import { NextRequest } from 'next/server';
import { createServerClient } from './server';

export interface AuthUser {
  id: string;
  email?: string;
  isGuest?: boolean;
}

export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function getAuthenticatedUser(req: NextRequest): Promise<AuthUser> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createServerClient();
    if (supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          return { id: user.id, email: user.email, isGuest: false };
        }
      } catch (err) {
        console.warn('Failed to verify supabase token:', err);
      }
    }
  }

  // Check custom guest/demo header if passed from client
  const guestHeader = req.headers.get('x-user-id');
  if (guestHeader) {
    return { id: guestHeader, isGuest: true };
  }

  // Default demo user fallback for frictionless local execution
  return { id: DEMO_USER_ID, email: 'traveler@timeloop.ai', isGuest: true };
}

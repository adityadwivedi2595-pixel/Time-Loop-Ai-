import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const characters = await DataStore.getCharacters(user.id);
    return NextResponse.json({ characters });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const body = await req.json();
    const saved = await DataStore.saveCharacter({
      ...body,
      user_id: user.id,
    });
    return NextResponse.json({ character: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

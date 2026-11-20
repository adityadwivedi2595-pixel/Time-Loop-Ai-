import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const stories = await DataStore.getStories(user.id);
    const characters = await DataStore.getCharacters(user.id);
    const savedItems = await DataStore.getSavedItems(user.id);

    return NextResponse.json({
      stories,
      characters,
      savedItems,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

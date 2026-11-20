import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const { sceneId } = await req.json();

    if (!sceneId) return NextResponse.json({ error: 'sceneId required' }, { status: 400 });
    const scene = await DataStore.getSceneById(sceneId);
    if (!scene) return NextResponse.json({ error: 'Scene not found' }, { status: 404 });

    return NextResponse.json({ choices: scene.choices });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

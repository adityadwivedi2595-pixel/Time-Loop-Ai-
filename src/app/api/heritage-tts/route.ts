import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const { text, voice, lang } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const trimmedText = text.trim();
    const selectedVoice = voice || (lang === 'en' ? 'en-IN-PrabhatNeural' : 'hi-IN-MadhurNeural');

    // Create unique cache key based on voice and text content
    const hash = crypto
      .createHash('sha256')
      .update(`${selectedVoice}:${trimmedText}`)
      .digest('hex')
      .slice(0, 16);

    // Check permanent cache, next cache, and public audio cache
    const permDir = path.join(process.cwd(), 'cache', 'heritage-audio');
    const nextDir = path.join(process.cwd(), '.next', 'cache', 'heritage-audio');
    const pubDir = path.join(process.cwd(), 'public', 'audio', 'heritage');

    [permDir, nextDir, pubDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        try { fs.mkdirSync(dir, { recursive: true }); } catch {}
      }
    });

    const fileName = `${hash}.mp3`;
    const permPath = path.join(permDir, fileName);
    const nextPath = path.join(nextDir, fileName);
    const pubPath = path.join(pubDir, fileName);
    const audioUrl = `/api/heritage-audio/${fileName}`;

    // Return cached audio if already generated in any cache location
    const existingFile = [permPath, nextPath, pubPath].find((p) => fs.existsSync(p));
    if (existingFile) {
      try {
        if (!fs.existsSync(permPath)) fs.copyFileSync(existingFile, permPath);
        if (!fs.existsSync(nextPath)) fs.copyFileSync(existingFile, nextPath);
        if (!fs.existsSync(pubPath)) fs.copyFileSync(existingFile, pubPath);
      } catch {}
      return NextResponse.json({ audioUrl, hash, cached: true });
    }

    // Write temp text file for safe unicode/hindi execution
    const tmpDir = path.join(process.cwd(), 'scripts', 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const tmpTextFile = path.join(tmpDir, `${hash}.txt`);
    fs.writeFileSync(tmpTextFile, trimmedText, 'utf8');

    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_edge_tts.py');
    // Execute python script with a 15-second safety timeout
    await execFileAsync('python', [scriptPath, tmpTextFile, selectedVoice, nextPath], {
      timeout: 15000
    });

    // Mirror to permanent cache and public cache
    try {
      if (fs.existsSync(nextPath)) {
        fs.copyFileSync(nextPath, permPath);
        fs.copyFileSync(nextPath, pubPath);
      }
    } catch {}

    // Clean up temporary text file
    try {
      fs.unlinkSync(tmpTextFile);
    } catch {}

    return NextResponse.json({ audioUrl, hash, cached: false });
  } catch (error: any) {
    console.error('[Heritage TTS API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'TTS generation failed' },
      { status: 500 }
    );
  }
}

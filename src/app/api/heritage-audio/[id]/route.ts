import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id.replace(/\.mp3$/, '');
    const permDir = path.join(process.cwd(), 'cache', 'heritage-audio');
    const nextDir = path.join(process.cwd(), '.next', 'cache', 'heritage-audio');
    const pubDir = path.join(process.cwd(), 'public', 'audio', 'heritage');

    const possiblePaths = [
      path.join(nextDir, `${rawId}.mp3`),
      path.join(permDir, `${rawId}.mp3`),
      path.join(pubDir, `${rawId}.mp3`)
    ];

    const filePath = possiblePaths.find((p) => fs.existsSync(p));

    if (!filePath) {
      return new NextResponse('Audio file not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const range = req.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      // @ts-ignore
      return new NextResponse(fileStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    console.error('[Audio Stream Error]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

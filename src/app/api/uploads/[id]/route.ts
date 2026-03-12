import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  if (!id) {
    return new NextResponse('File not found', { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'data', 'uploads', id);

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    if (id.endsWith('.pdf')) contentType = 'application/pdf';
    else if (id.endsWith('.jpeg') || id.endsWith('.jpg')) contentType = 'image/jpeg';
    else if (id.endsWith('.png')) contentType = 'image/png';
    else if (id.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (id.endsWith('.webp')) contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

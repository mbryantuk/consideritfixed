import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const resolvedParams = await params;
  const { requestId } = resolvedParams;
  const filename = requestId;

  // Basic security to avoid directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const pdfPath = path.join(process.cwd(), 'data', 'pdfs', filename);

  try {
    const fileBuffer = await fs.readFile(pdfPath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error reading PDF file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
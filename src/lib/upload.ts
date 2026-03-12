import { promises as fs } from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export async function saveFileUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // 1. Validate File Size
  if (file.size > MAX_FILE_SIZE) {
    console.error("File upload rejected: Size exceeds 5MB limit.");
    return null;
  }

  // 2. Validate File Type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    console.error(`File upload rejected: Unsupported mime type ${file.type}`);
    return null;
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.name);
  const filename = `${uniqueSuffix}${ext}`;
  
  // Save to the persistent data volume
  const uploadDir = path.join(process.cwd(), 'data', 'uploads');
  
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return `/api/uploads/${filename}`;
  } catch (err) {
    console.error("Error saving file:", err);
    return null;
  }
}

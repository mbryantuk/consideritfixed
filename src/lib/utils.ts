import { prisma } from "./prisma";
import DOMPurify from "isomorphic-dompurify";

export function renderMarkdown(md: string) {
  if (!md) return { __html: "" };
  
  const html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' style='max-width:100%; border-radius:8px;' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' style='color:var(--secondary-hover)'>$1</a>")
    .replace(/\n/gim, '<br />');
  
  const sanitized = DOMPurify.sanitize(html);
  
  return { __html: sanitized };
}

export async function logAudit(
  adminId: string,
  action: string,
  targetId?: string,
  targetType?: string,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        targetId,
        targetType,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

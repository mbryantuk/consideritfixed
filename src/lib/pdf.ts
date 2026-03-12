import puppeteer from 'puppeteer-core';
import path from 'path';
import { promises as fs } from 'fs';

export async function generatePdf(url: string, filename: string): Promise<string> {
  const pdfDir = path.join(process.cwd(), 'data', 'pdfs');
  const filePath = path.join(pdfDir, filename);

  try {
    await fs.mkdir(pdfDir, { recursive: true });
    
    // Check if it already exists to avoid regenerating (optional caching)
    // For now we regenerate to ensure it's up to date.

    let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
    
    // Fallback for local development if Chromium is not in /usr/bin (e.g. Mac/Windows)
    if (process.env.NODE_ENV !== 'production') {
       // On macOS typically: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
       // On Windows typically: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
       // We'll let puppeteer auto-detect if we don't set executablePath, but puppeteer-core requires it.
       // It's better to install standard 'puppeteer' for local dev, but let's try to use system chrome.
       executablePath = process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : executablePath;
    }

    const browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: true
    });

    const page = await browser.newPage();
    
    // We need to pass auth cookies if the page is protected.
    // However, the print pages for quotes/invoices might be protected by NextAuth.
    // To bypass this for PDF generation, we could pass a secret token in the URL or headers.
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });

    await browser.close();

    await fs.writeFile(filePath, pdfBuffer);
    
    return `/api/pdfs/view/${filename}`;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

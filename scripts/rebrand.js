/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.json') || fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(/MakeItWork/g, 'Consider IT Fixed');
      content = content.replace(/Make It Work/gi, 'Consider IT Fixed');
      content = content.replace(/makeitwork\.co\.uk/g, 'consideritfixed.co.uk');
      content = content.replace(/makeitwork\.mbryantuk\.uk/g, 'consideritfixed.mbryantuk.uk');
      // Replace lowercase makeitwork ONLY in strings/texts, not imports. 
      // Actually we have no imports with makeitwork since it's a relative/alias repo.
      content = content.replace(/makeitwork/g, 'consideritfixed');
      
      // Fix case matching for Consider IT Fixed
      content = content.replace(/Consider IT Fixed Tech Support/g, 'Consider IT Fixed');
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walkDir('./src');
walkDir('./public');
walkDir('./prisma');

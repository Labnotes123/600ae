import fs from 'fs';
import path from 'path';

const sourceDir = '/tmp/C-_Project_OnTap600/Presentation/Nội dung 600 câu hỏi lý thuyết (Ảnh)';
const targetDir = './public/images/questions';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

let count = 0;
const files = fs.readdirSync(sourceDir);
for (const file of files) {
  const match = file.match(/\((\d+)\)\.jpg/);
  if (match) {
    const id = match[1];
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, `${id}.jpg`));
    count++;
  }
}
console.log(`Copied ${count} images.`);

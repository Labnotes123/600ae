import fs from 'fs';
try {
  const files = fs.readdirSync('/tmp/C-_Project_OnTap600/Presentation/Nội dung 600 câu hỏi lý thuyết (Ảnh)');
  console.log(`Found ${files.length} files.`);
} catch (e) {
  console.log('Error:', e.message);
}

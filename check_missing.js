import fs from 'fs';
const content = fs.readFileSync('./src/data/questions.ts', 'utf8');
const noText = (content.match(/Vui lòng xem thông tin/g) || []).length;
const emptyOptions = (content.match(/options: \[\]/g) || []).length;
console.log(`Questions missing text: ${noText}`);
console.log(`Questions with empty options: ${emptyOptions}`);

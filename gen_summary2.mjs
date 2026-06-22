import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./parsed_existing.json', 'utf8'));
const summary = data.map(q => `${q.id}:${q.options.length}:${q.correctAnswerIndex + 1}`).join(',');
fs.writeFileSync('./summary.txt', summary);
console.log('done');

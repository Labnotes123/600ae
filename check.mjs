import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./parsed_existing.json', 'utf8'));

for (let i = 301; i <= 600; i++) {
  const q = data.find((x) => x.id === i);
  if (q) {
     console.log(`${q.id}: ${q.options.length} options`);
  }
}

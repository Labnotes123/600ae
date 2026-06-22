import fs from 'fs';
import ts from 'typescript';

const content = fs.readFileSync('./src/data/questions.ts', 'utf8');

// A very fast regex approach to extract data
const items = [];
const regex = /\{[\s\S]*?id:\s*(\d+),[\s\S]*?question:\s*`([^`]+)`|"([^"]+)"|'([^']+)',[\s\S]*?options:\s*\[([\s\S]*?)\],[\s\S]*?explanation:\s*`([^`]+)`|"([^"]+)"|'([^']+)'/g;

// Instead of pure regex, it's safer to use eval or new Function after stripping imports
const codeToEval = content.replace(/import.*?;/g, '').replace(/export const CHAPTERS.*?(?=export const mockQuestions)/s, '');
let data;
try {
  const match = content.match(/export const mockQuestions: Question\[\] = (\[[\s\S]*\]);/);
  if (match) {
    const rawArray = match[1];
    data = eval(`(${rawArray})`);
  }
} catch (e) {
  console.log("Eval failed", e);
}

if (!data) {
  const lines = content.split('\n');
  let inQ = false, curr = {};
  for(let line of lines) {
    if(line.includes('{')) { inQ = true; curr = {}; }
    if(inQ) {
       let idM = line.match(/id:\s*(\d+)/); if(idM) curr.id = parseInt(idM[1]);
       let qM = line.match(/question:\s*"(.*?)"/); if(qM) curr.question = qM[1];
       let eM = line.match(/explanation:\s*"(.*?)"/); if(eM) curr.explanation = eM[1];
       let oM = line.match(/options:\s*\[(.*?)\]/); if(oM) curr.options = oM[1].split(',').map(s=>s.replace(/"/g,'').trim());
    }
    if(line.includes('}')) { inQ = false; if(curr.id) items.push(curr); }
  }
  data = items;
}

fs.writeFileSync('./parsed_existing.json', JSON.stringify(data, null, 2));
console.log(`Parsed ${data.length} existing items.`);

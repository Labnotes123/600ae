const fs = require('fs');

const tsFilePath = '/app/applet/src/data/questions.ts';
let tsContent = fs.readFileSync(tsFilePath, 'utf8');

const parsedJson = require('/tmp/parsed_questions.json');
const map = new Map();
parsedJson.forEach(q => {
  map.set(q.id, q);
});

// We need to replace the `options: [...]`, `correctAnswerIndex: ...`, `explanation: ...`, `isFatal: ...`
// Since text replacement in a 6000 line file is tricky, let's parse it using a replacer
const replaced = tsContent.replace(/\{\s*id:\s*(\d+),[\s\S]*?isFatal:\s*(true|false)\s*\}/g, (match, idStr) => {
  const id = parseInt(idStr, 10);
  const data = map.get(id);
  if (!data) return match; // fallback

  // Re-build this block
  let chapterMatch = match.match(/chapter:\s*(\d+)/);
  let chapter = chapterMatch ? chapterMatch[1] : 1;
  let imgMatch = match.match(/imageUrl:\s*("[^"]*")/);
  let img = imgMatch ? imgMatch[1] : `"/images/questions/${id}.jpg"`;

  const safeOptions = JSON.stringify(data.options);
  const expSafe = JSON.stringify(data.explanation || 'Không có giải thích');
  const dQuestion = JSON.stringify(data.question);

  return `{
    id: ${id},
    chapter: ${chapter},
    question: ${dQuestion},
    options: ${safeOptions},
    correctAnswerIndex: ${data.correctAnswerIndex},
    explanation: ${expSafe},
    imageUrl: ${img},
    isFatal: ${data.isFatal}
  }`;
});

fs.writeFileSync(tsFilePath, replaced, 'utf8');
console.log('Patched questions.ts with real data from docx');

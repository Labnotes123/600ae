import fs from 'fs';
const content = fs.readFileSync('./database.sql', 'utf16le');
const lines = content.split('\n');

const questions = [];
const regex = /INSERT \[dbo\]\.\[Question\] \(\[QuestionID\], \[ImageID\], \[NumberAnser\], \[Answer\], \[Liet\](?:, \[.*?\])?\) VALUES \((\d+), (\d+), (\d+), (\d+), (\d+)/;

for (const line of lines) {
  const match = line.match(regex);
  if (match) {
    questions.push({
      id: parseInt(match[1]),
      imageId: parseInt(match[2]),
      numberAnswer: parseInt(match[3]),
      answer: parseInt(match[4]),
      liet: parseInt(match[5]) === 1
    });
  }
}
fs.writeFileSync('./db_parsed.json', JSON.stringify(questions, null, 2));
console.log(`Parsed ${questions.length} questions from SQL.`);

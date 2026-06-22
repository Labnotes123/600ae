import fs from 'fs';
const content = fs.readFileSync('./database.sql', 'utf16le');
const lines = content.split('\n');
const questionInserts = lines.filter(line => line.includes('INSERT [dbo].[Question]'));
console.log(`Found ${questionInserts.length} question insert lines.`);
if (questionInserts.length > 0) {
  console.log(questionInserts[0].substring(0, 500));
}

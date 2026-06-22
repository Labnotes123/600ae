import fs from 'fs';
const content = fs.readFileSync('./database.sql', 'utf16le');
const idx = content.indexOf('CREATE TABLE [dbo].[Question]');
if (idx > -1) {
  console.log(content.substring(idx, idx + 1000));
} else {
  console.log('Not found CREATE TABLE');
}

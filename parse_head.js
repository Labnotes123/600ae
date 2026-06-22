import fs from 'fs';
const content = fs.readFileSync('./database.sql', 'utf16le');
console.log(content.substring(0, 1000));

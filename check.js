import fs from 'fs';
const content = fs.readFileSync('./database.sql');
console.log(content.slice(0, 100));

import fs from 'fs';
const files = fs.readdirSync('./public/images/questions');
console.log(`Now have ${files.length} images.`);

const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/PhucNood/C-_Project_OnTap600/main/database.sql', (res) => {
  const file = fs.createWriteStream('./database.sql');
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed.');
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});

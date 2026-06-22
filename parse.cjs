const fs = require('fs');
const html = fs.readFileSync('/tmp/HangB2.html', 'utf-8');

const questions = [];
let currentQuestion = null;

const chunks = html.replace(/<strong>(.*?)<\/strong>/g, '$1').replace(/<em>(.*?)<\/em>/g, '$1').split(/(?=<p>|<ol>|<ul>)/);

for (const chunk of chunks) {
  if (chunk.startsWith('<p>')) {
    const text = chunk.replace(/<[^>]+>/g, '').trim();
    if (/^Câu\s*\d+\s*:/i.test(text)) {
      if (currentQuestion) questions.push(currentQuestion);
      const match = text.match(/^Câu\s*(\d+)\s*:\s*(.*)/i);
      currentQuestion = {
        id: parseInt(match[1], 10),
        question: text,
        options: [],
        explanation: 'Không có giải thích',
        isFatal: false
      };
    } else if (text.toLowerCase().startsWith('gợi ý:')) {
      if (currentQuestion) {
        currentQuestion.explanation = text.replace(/^gợi ý:\s*/i, '');
      }
    } else if (text.toLowerCase().startsWith('đáp án')) {
      if (currentQuestion) {
        const ansMatch = text.match(/\d+/);
        if (ansMatch) {
          currentQuestion.correctAnswerIndex = parseInt(ansMatch[0], 10) - 1;
        }
      }
    } else if (text.toLowerCase().includes('điểm liệt') || text.toLowerCase().includes('câu điểm liệt')) {
      if (currentQuestion) {
        currentQuestion.isFatal = true;
      }
    }
  } else if (chunk.startsWith('<ol>') || chunk.startsWith('<ul>')) {
    if (currentQuestion) {
      const lis = chunk.split('<li>').slice(1);
      for (const li of lis) {
        const liText = li.replace(/<\/li>.*$/s, '').replace(/<[^>]+>/g, '').trim();
        currentQuestion.options.push(liText);
      }
    }
  }
}
if (currentQuestion) questions.push(currentQuestion);

fs.writeFileSync('/tmp/parsed_questions.json', JSON.stringify(questions, null, 2));
console.log('Parsed ' + questions.length + ' questions');


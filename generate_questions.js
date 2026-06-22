import fs from 'fs';

const dbInfo = JSON.parse(fs.readFileSync('./db_parsed.json', 'utf8'));
const existing = JSON.parse(fs.readFileSync('./parsed_existing.json', 'utf8'));

const CHAPTERS = [
  { id: 1, name: "Luật Giao Thông", total: 180 },
  { id: 2, name: "Đạo Đức & Văn Hóa", total: 25 },
  { id: 3, name: "Kỹ Thuật Lái Xe", total: 58 },
  { id: 4, name: "Cấu Tạo Sửa Chữa", total: 37 },
  { id: 5, name: "Rừng Biển Báo", total: 185 },
  { id: 6, name: "Trận Chiến Sa Hình", total: 115 }
];

function getChapter(id) {
  if (id <= 180) return 1;
  if (id <= 205) return 2;
  if (id <= 263) return 3;
  if (id <= 300) return 4;
  if (id <= 485) return 5;
  return 6;
}

const finalQuestions = dbInfo.map(q => {
  const ex = existing.find(e => e.id === q.id) || {};
  
  let qText = ex.question || `Câu ${q.id}: Vui lòng xem thông tin chi tiết trong ảnh bên dưới`;
  // Clean up existing messy texts
  if (qText.startsWith('Câu') && !qText.includes(':')) {
    qText = qText.replace(/^Câu \d+/, `Câu ${q.id}:`);
  }
  
  let options = [];
  if (ex.options && ex.options.length === q.numberAnswer) {
    options = ex.options;
  } else {
    // try to fix or pad/truncate
    options = ex.options || [];
    if (options.length > q.numberAnswer) {
      options = options.slice(0, q.numberAnswer);
    } else if (options.length < q.numberAnswer) {
      while (options.length < q.numberAnswer) {
        options.push(`Đáp án ${options.length + 1}`);
      }
    }
  }

  let explanation = ex.explanation || "Không có giải thích";
  if (q.liet) {
    explanation += " Lưu ý: Đây là câu hỏi điểm liệt!";
    explanation = explanation.trim();
  }

  // Answer is 1-indexed in database => make it 0-indexed
  const correctAnswerIndex = (q.answer > 0 && q.answer <= q.numberAnswer) ? q.answer - 1 : 0;

  return {
    id: q.id,
    chapter: getChapter(q.id),
    question: qText,
    options: options,
    correctAnswerIndex: correctAnswerIndex,
    explanation: explanation,
    imageUrl: `/images/questions/${q.imageId}.jpg`,
    isFatal: q.liet
  };
});

let out = `import { Question } from "../types";\n\n`;
out += `export const CHAPTERS = ${JSON.stringify(CHAPTERS, null, 2)};\n\n`;
out += `export const mockQuestions: Question[] = ${JSON.stringify(finalQuestions, null, 2)};\n`;

fs.writeFileSync('./src/data/questions.ts', out);
console.log("Successfully generated src/data/questions.ts");

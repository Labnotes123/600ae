using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
    public class DAOLiet
    {
        DataTable dt;
        public string ImageLiet(int numLiet)
        {
            
            string sqlLiet = "select Image from Question join ImageCauHoi on dbo.Question.ImageID = ImageCauHoi.ImageID where Liet =1";
            dt = new DataProvider().executeQuery(sqlLiet);
            string image = "../../Nội dung 600 câu hỏi lý thuyết (Ảnh)/" + dt.Rows[numLiet - 1]["Image"].ToString();

            return image;
        }

        public int ShowDapAn(int numLiet)
        {
            string sqlDapAn = "select Answer from Question join ImageCauHoi on dbo.Question.ImageID = ImageCauHoi.ImageID where Liet =1";
            dt = new DataProvider().executeQuery(sqlDapAn);
            int answer =Convert.ToInt32(dt.Rows[numLiet - 1]["Answer"]);
            return answer;
        }

        public int NumberAnswer(int numLiet)
        {
            string sqlnumberAnswer = "select NumberAnser from Question join ImageCauHoi on dbo.Question.ImageID = ImageCauHoi.ImageID where Liet =1";
            dt = new DataProvider().executeQuery(sqlnumberAnswer);
            int numberAnswer = Convert.ToInt32(dt.Rows[numLiet - 1]["NumberAnser"]);
            return numberAnswer;
        }
    }
}

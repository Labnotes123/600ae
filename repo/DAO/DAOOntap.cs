using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
   public class DAOOntap
    {
        LinQDataContext linQ = new LinQDataContext();
        DataTable dt;
        public string showDapAn(int id)
        {
            string sqldapAn = "select Answer from Question where QuestionID=" + id;
            dt = new DataProvider().executeQuery(sqldapAn);
          string answer=  dt.Rows[0]["Answer"].ToString();

            return answer;
        }

        public int NumberAnswer(int id)
        {
            string sqldapAn = "select NumberAnser from Question where QuestionID=" + id;
            dt = new DataProvider().executeQuery(sqldapAn);
            int numberAnswer = Convert.ToInt32(dt.Rows[0]["NumberAnser"]);

            return numberAnswer;
        }

        /* public string showDapAn(int id)
{
string dapan = (from quest in linQ.Questions where quest.QuestionID == id select quest.Answer).FirstOrDefault().ToString();
return dapan;
}*/

        public string getImage(int numQ)
        {
           
            string sqlImage = "select Image  from ImageCauHoi join Question on dbo.ImageCauHoi.ImageID =dbo.Question.ImageID where QuestionID="+numQ;
            dt = new DataProvider().executeQuery(sqlImage);          
            return "../../Nội dung 600 câu hỏi lý thuyết (Ảnh)/" + dt.Rows[0]["Image"].ToString();
        }
 

    }
}

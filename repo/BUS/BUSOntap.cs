using DAO;
using System;

namespace BUS
{
    public class BUSOntap
    {


        public string ShowDapAn(int id)
        {
            return new DAOOntap().showDapAn(id);
        }

        public string getImage(int numQ)
        {
            return new DAOOntap().getImage(numQ);
        }

        public int NumberAnswer(int id)
        {
            return new DAOOntap().NumberAnswer(id);
        }
    }
}

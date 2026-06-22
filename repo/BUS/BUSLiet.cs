using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAO;
namespace BUS
{
    public class BUSLiet
    {
        public string ImageLiet(int numLiet)
        {
            return new DAOLiet().ImageLiet(numLiet);
        }

        public int NumberAnswer(int numLiet)
        {
            return new DAOLiet().NumberAnswer( numLiet);
        }

        public int ShowDapAn(int numLiet)
        {
            return new DAOLiet().ShowDapAn( numLiet);
        }
    }
}

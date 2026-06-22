using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Presentation
{
    public partial class frmMenu : Form
    {
        public frmMenu()
        {
            InitializeComponent();
        }

        private void frmMenu_Load(object sender, EventArgs e)
        {
            
        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Hide();
            new FrmMeo().Show();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            this.Hide();
            new FrmOnTap().Show();
        }

        private void btnDiemLiet_Click(object sender, EventArgs e)
        {
            this.Hide();
            new FrmLiet().Show();
        }
    }
}

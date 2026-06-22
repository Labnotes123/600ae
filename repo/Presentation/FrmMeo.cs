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
    public partial class FrmMeo : Form
    {
        public FrmMeo()
        {
            InitializeComponent();
        }

        private void FrmMeo_Load(object sender, EventArgs e)
        {
            txtContent.Width = this.Width;
            txtContent.Height = this.Height - 100;
            btnBack.Location = new Point(50, this.Height - 75 );
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            this.Hide();
            new frmMenu().Show();
        }
    }
}

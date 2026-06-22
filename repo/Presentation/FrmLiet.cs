using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using BUS;
namespace Presentation
{
    public partial class FrmLiet : Form
    {
        public FrmLiet()
        {
            InitializeComponent();
            clearData();
        }
        int numLiet = 1;
        int answer=0;
        private void clearData()
        {
            lblStatus.Hide();
            lblDapAn.Hide();
            radioButton1.Checked = false;
            radioButton2.Checked = false;
            radioButton3.Checked = false;
            radioButton4.Checked = false;
            
        }

        private void showDungSai()
        {
            lblStatus.Hide();

           
            int trueAnswer = new BUSLiet().ShowDapAn(numLiet);
         
            if (answer == trueAnswer)
            {
                lblStatus.Show();
                lblStatus.Text = "Đúng";
                lblStatus.ForeColor = Color.Green;
                lblDapAn.Text ="Đáp án:"+ trueAnswer.ToString();
            }
            
            else
            {
                lblStatus.Show();
                lblStatus.Text = "Sai";
                lblStatus.ForeColor = Color.Red;
                lblDapAn.Text = "Đáp án:" + trueAnswer.ToString();
            }
        }

        private void showhideAnswer()
        {
            int numA = new BUSLiet().NumberAnswer(numLiet);
            if (numA == 2)
            {
                radioButton1.Show();
                radioButton2.Show();
                radioButton3.Hide();
                radioButton4.Hide();
            }
            if (numA == 3)
            {
                radioButton1.Show();
                radioButton2.Show();
                radioButton3.Show();
                radioButton4.Hide();
            }
            if (numA == 4)
            {
                radioButton1.Show();
                radioButton2.Show();
                radioButton3.Show();
                radioButton4.Show();
            }
        }

       

        private void FrmLiet_Load(object sender, EventArgs e)
        {
            clearData();
            
 
            btnPre.Hide();
            string image = new BUSLiet().ImageLiet(numLiet);
            picLiet.Image = Image.FromFile(image);
            txtNum.Text = 1.ToString();
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            this.Hide();
            new frmMenu().Show();
        }

        private void btnNext_Click(object sender, EventArgs e)
        {
          
            numLiet++;
            string image = new BUSLiet().ImageLiet(numLiet);
            picLiet.Image = Image.FromFile(image);
            lblNum.Text = numLiet.ToString();
            txtNum.Text = numLiet.ToString();
          
        }

        private void lblNum_TextChanged(object sender, EventArgs e)
        {
            clearData();
            showhideAnswer();
           
            int num = Convert.ToInt32(lblNum.Text);
            if (num == 1)
            {
                btnPre.Hide();
                btnNext.Show();
            }
            if (num == 600)
            {
                btnPre.Show();
                btnNext.Hide();
            }
            if (num > 1 && num < 600)
            {
                btnNext.Show();
                btnPre.Show();
            }
        }

      

        private void btnPre_Click(object sender, EventArgs e)
        {
            clearData();
            numLiet--;
            string image = new BUSLiet().ImageLiet(numLiet);
            picLiet.Image = Image.FromFile(image);
            lblNum.Text = numLiet.ToString();
            txtNum.Text = numLiet.ToString();
        }

        private void txtNum_KeyPress(object sender, KeyPressEventArgs e)
        {
            try
            {

                if (e.KeyChar == (char)(Keys.Enter))
                {
                    numLiet = Convert.ToInt32(txtNum.Text);
                    if (numLiet >= 1 && numLiet <= 600)
                    {
                        picLiet.Image = Image.FromFile(new BUSOntap().getImage(Convert.ToInt32(txtNum.Text)));
                        lblNum.Text = numLiet.ToString();
                        lblDapAn.Text = "Đáp án: " + new BUSOntap().ShowDapAn(numLiet);
                    }
                    else
                    {
                        MessageBox.Show("Invalid Number of question");
                    }
                }
            }
            catch (Exception)
            {
                MessageBox.Show("Invalid Number of question");

            }
        }

        private void btnSubmit_Click(object sender, EventArgs e)
        {
            
            showDungSai();
            lblDapAn.Show();
            
        }

      

        private void radioButton1_CheckedChanged(object sender, EventArgs e)
        {
            answer = 1;
        }

        private void radioButton2_CheckedChanged(object sender, EventArgs e)
        {
            answer = 2;
        }

        private void radioButton3_CheckedChanged(object sender, EventArgs e)
        {
            answer = 3;
        }

        private void radioButton4_CheckedChanged(object sender, EventArgs e)
        {
            answer = 4;
        }
    }
}

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
    public partial class FrmOnTap : Form
    {
        int numQ = 1;
        int answer;
        public FrmOnTap()
        {
            InitializeComponent();
            showhideAnswer();
            showDungSai();
            ClearData();
        }

        private void ClearData()
        {
            lblStatus.Hide();
            lblDapAn.Hide();
            radioButton1.Checked = false;
            radioButton2.Checked = false;
            radioButton3.Checked = false;
            radioButton4.Checked = false;
            answer = 0;
        }

        private void showDungSai()
        {
            
                lblStatus.Hide();
            
           

            if (answer== Convert.ToInt32(new BUSOntap().ShowDapAn(numQ)))
            {
                lblStatus.Show();
                lblStatus.Text = "Đúng";
                lblStatus.ForeColor = Color.Green;
            }
            if (answer == 0)
            {
                lblStatus.Show();
                lblStatus.Text = "Chưa chọn đáp án";
                lblStatus.ForeColor = Color.Green;
            }
            else
            {
                lblStatus.Show();
                lblStatus.Text = "Sai";
                lblStatus.ForeColor = Color.Red;
            }



        }

        private void showhideAnswer()
        {
            int numA = new BUSOntap().NumberAnswer(numQ);
            if (numA==2)
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

    

        private void FrmOnTap_Load(object sender, EventArgs e)
        {
            timer1.Start();
            ClearData();
            showhideAnswer();
          
            btnPre.Hide();
            lblNumQues.Text = 1.ToString();          
            picCauHoi.Image = Image.FromFile(new BUSOntap().getImage(1));
            lblDapAn.Text = "Đáp án: " + new BUSOntap().ShowDapAn(1);
            txtNumQues.Text = "1";
            picCauHoi.Focus();

        }

        private void btnNext_MouseHover(object sender, EventArgs e)
        {
            
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            this.Hide();
            new frmMenu().Show();
        }

        private void btnNext_Click(object sender, EventArgs e)
        {

            ClearData();
            numQ++;
            lblNumQues.Text = numQ.ToString();          
            picCauHoi.Image = Image.FromFile((new BUSOntap().getImage(numQ)));
            lblDapAn.Text = "Đáp án: " + new BUSOntap().ShowDapAn(numQ).ToString();
            txtNumQues.Text = numQ.ToString();

        }

        private void btnPre_Click(object sender, EventArgs e)
        {

            ClearData();
            numQ--;
            lblNumQues.Text = numQ.ToString();
            picCauHoi.Image = Image.FromFile((new BUSOntap().getImage(numQ)));
            lblDapAn.Text = "Đáp án: " + new BUSOntap().ShowDapAn(numQ).ToString();
            txtNumQues.Text = numQ.ToString();
        }

        private void FrmOnTap_KeyPress(object sender, KeyPressEventArgs e)
        {
            
            if (e.KeyChar==(char)(Keys.Left))
            {
                btnNext_Click(sender, e);
            }
        }

        private void txtNumQues_KeyPress(object sender, KeyPressEventArgs e)
        { 
            try
            {

                if (e.KeyChar==(char)(Keys.Enter))
                {
                     numQ = Convert.ToInt32(txtNumQues.Text);
                    if (numQ>=1&& numQ<=600)
                    {
                        picCauHoi.Image = Image.FromFile(new BUSOntap().getImage(Convert.ToInt32(txtNumQues.Text)));
                        lblNumQues.Text = numQ.ToString();
                        lblDapAn.Text = "Đáp án: "+ new BUSOntap().ShowDapAn(numQ);
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

        private void lblNumQues_TextChanged(object sender, EventArgs e)
        {
            ClearData();
            showhideAnswer();

            int num= Convert.ToInt32(lblNumQues.Text);
            if (num==1)
            {
                btnPre.Hide();
                btnNext.Show();
            }
            if (num==600)
            {
                btnPre.Show();
                btnNext.Hide();
            }
            if(num>1&& num<600)
            {
                btnNext.Show();
                btnPre.Show();
            }
        }

        private void btnSubmit_Click(object sender, EventArgs e)
        {
            lblDapAn.Show();
            showDungSai();
        }

        private void radioButton4_CheckedChanged(object sender, EventArgs e)
        {
            RadioButton r = (RadioButton)sender;
            answer = Convert.ToInt32(r.Text);
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            int min = Convert.ToInt32(lblMinutes.Text);
            int second = Convert.ToInt32(lblSecond.Text);
            second--;
            if (second<0)
            {
                second = 59;
                min--;
            }
            if (second<10)
            {
                lblSecond.Text = "0" + second;
            }
            else
            {
                lblSecond.Text = second.ToString();
            }
            if (min<10)
            {
                lblMinutes.Text = "0" + min;
            }
            else
            {
                lblMinutes.Text = min.ToString();
            }

            if (min== 0 && second==0)
            {
                btnSubmit_Click(sender, e); 
            }
        }
    }
}

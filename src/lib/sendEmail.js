import nodemailer from "nodemailer";


export const sendMail = async (email, token) => {
    try {
        const url = process.env.URL_SEND;
      const link = `${url}/reset-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOption = {
        from: "realllraja@gmail.com",
        to: email,
        subject: "Password Reset Request for LifeTrack",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
              
              body {
                  font-family: 'Poppins', Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f7fa;
                  color: #333;
              }
              
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              
              .header {
                  background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
                  padding: 30px 0;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
              }
              
              .logo {
                  color: white;
                  font-size: 28px;
                  font-weight: 700;
                  text-decoration: none;
              }
              
              .content {
                  background-color: white;
                  padding: 30px;
                  border-radius: 0 0 8px 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
              }
              
              h1 {
                  color: #6e48aa;
                  font-size: 24px;
                  margin-top: 0;
              }
              
              p {
                  line-height: 1.6;
                  margin-bottom: 20px;
              }
              
              .button {
                  display: inline-block;
                  background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
                  color: white !important;
                  text-decoration: none;
                  padding: 12px 30px;
                  border-radius: 30px;
                  font-weight: 600;
                  margin: 20px 0;
                  transition: all 0.3s ease;
              }
              
              .button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 5px 15px rgba(110, 72, 170, 0.3);
              }
              
              .footer {
                  text-align: center;
                  padding: 20px 0;
                  color: #777;
                  font-size: 12px;
              }
              
              .code {
                  font-size: 18px;
                  font-weight: 600;
                  letter-spacing: 2px;
                  color: #6e48aa;
                  text-align: center;
                  margin: 20px 0;
                  padding: 10px;
                  background-color: #f5f0fa;
                  border-radius: 5px;
              }
              
              .divider {
                  height: 1px;
                  background-color: #eee;
                  margin: 25px 0;
              }
              
              .info-box {
                  background-color: #f9f9f9;
                  border-left: 4px solid #6e48aa;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 0 4px 4px 0;
              }
              
              @media (prefers-reduced-motion: no-preference) {
                  .button {
                      animation: pulse 2s infinite;
                  }
                  
                  @keyframes pulse {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                      100% { transform: scale(1); }
                  }
              }
              
              @media only screen and (max-width: 600px) {
                  .container {
                      width: 100%;
                      padding: 10px;
                  }
                  
                  .content {
                      padding: 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <a href="https://life-trackor.netlify.app/" class="logo">LifeTrack</a>
              </div>
              
              <div class="content">
                  <h1>Password Reset Request</h1>
                  
                  <p>Hello,</p>
                  
                  <p>We received a request to reset your password for your LifeTrack account. If you didn't make this request, you can safely ignore this email.</p>
                  
                  <p>To reset your password, click the button below:</p>
                  
                  <div style="text-align: center;">
                      <a href="${link}" class="button">Reset Password</a>
                  </div>
                  
                  <p>Or copy and paste this link into your browser:</p>
                  
                  <div class="code">${link}</div>
                  
                  <div class="divider"></div>
                  
                  <div class="info-box">
                      <p><strong>Important Security Information:</strong></p>
                      <ul>
                          <li>This link will expire in 24 hours</li>
                          <li>Never share your password or this link with anyone</li>
                          <li>Our support team will never ask for your password</li>
                      </ul>
                  </div>
                  
                  <p>If you're having trouble with the button above, please contact our support team at <a href="mailto:support@LifeTrack.com">support@LifeTrack.com</a>.</p>
                  
                  <p>Best regards,<br>The LifeTrack Team</p>
              </div>
              
              <div class="footer">
                  <p>© ${new Date().getFullYear()} LifeTrack. All rights reserved.</p>
                  <p>If you didn't request this password reset, please <a href="mailto:security@LifeTrack.com">contact our security team</a> immediately.</p>
                  <p>
                      <a href="https://LifeTrack.com/privacy">Privacy Policy</a> | 
                      <a href="https://LifeTrack.com/terms">Terms of Service</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
        `,
      };
    await transporter.sendMail(mailOption);

    return {error:false,message:"Email sent successfully"};
  } catch (error) {
    console.log(error);
    return {error,message:error.message};
  }
};

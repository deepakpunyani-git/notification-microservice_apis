import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const { EMAIL_USER, EMAIL_PASSWORD, FAST2SMS_API_KEY } = process.env;

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  appName: string 
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${appName}" <${EMAIL_USER}>`, 
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};


export const sendSMS = async (
  phone: string,
  message: string,
  appName: string 
) => {
  const brandedMessage = `${appName}: ${message}`; 

  await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      variables_values: brandedMessage,
      route: 'q',
      numbers: phone,
    },
    {
      headers: {
        authorization: FAST2SMS_API_KEY as string,
        'Content-Type': 'application/json',
      },
    }
  );
};

import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const { EMAIL, EMAIL_PASSWORD, FAST2SMS_API_KEY } = process.env;

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: EMAIL,
    to,
    subject,
    text,
  });
};

export const sendSMS = async (phone: string, message: string) => {
  await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      variables_values: message,
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

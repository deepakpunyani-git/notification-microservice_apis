import { Request, Response } from 'express';
import Notification from '../model/Notification';
import { sendEmail, sendSMS } from '../utils/helpers';

export const listSMSNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', status, site } = req.query;

    const filters: any = { site, type: 'sms' };
    if (status) filters.status = status;

    const notifications = await Notification.find(filters)
      .sort({ [sortBy as string]: order === 'desc' ? -1 : 1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Notification.countDocuments(filters);

    res.json({ success: true, data: notifications, total, page: +page, limit: +limit });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS notifications',
      error: error.message,
    });
  }
};

export const listEmailNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', status, site } = req.query;

    const filters: any = { site, type: 'email' };
    if (status) filters.status = status;

    const notifications = await Notification.find(filters)
      .sort({ [sortBy as string]: order === 'desc' ? -1 : 1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Notification.countDocuments(filters);

    res.json({ success: true, data: notifications, total, page: +page, limit: +limit });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email notifications',
      error: error.message,
    });
  }
};

export const sendEmailNotification = async (req: Request, res: Response): Promise<void> => {
  const { site, to, subject, message, appname, log = true } = req.body;

  if (!site || !to || !message || !appname) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }

  const recipients: string[] = Array.isArray(to) ? to : [to];

  const results: {
    to: string;
    status: 'sent' | 'failed';
    error?: string;
  }[] = [];

  for (const recipient of recipients) {
    let status: 'sent' | 'failed' = 'sent';
    let errorMessage = '';

    try {
      await sendEmail(recipient, subject || '', message, appname); 
    } catch (err) {
      status = 'failed';
      errorMessage = (err as Error).message;
    }

    if (log) {
      try {
        await Notification.create({
          site,
          appname,
          type: 'email',
          to: recipient,
          subject,
          message,
          status,
          sentAt: new Date(),
        });
      } catch (logErr) {
        console.error('Failed to log email notification:', logErr);
      }
    }

    results.push({ to: recipient, status, ...(status === 'failed' && { error: errorMessage }) });
  }

  res.json({
    success: true,
    message: 'Email notification(s) processed',
    results,
  });
};

export const sendSMSNotification = async (req: Request, res: Response): Promise<void> => {
  const { site, to, message, appName, log = true } = req.body;

  if (!site || !to || !message || !appName) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }

  const recipients: string[] = Array.isArray(to) ? to : [to];

  const results: {
    to: string;
    status: 'sent' | 'failed';
    error?: string;
  }[] = [];

  for (const recipient of recipients) {
    let status: 'sent' | 'failed' = 'sent';
    let errorMessage = '';

    try {
      await sendSMS(recipient, message, appname); 
    } catch (err) {
      status = 'failed';
      errorMessage = (err as Error).message;
    }

    if (log) {
      try {
        await Notification.create({
          site,
          appname,
          type: 'sms',
          to: recipient,
          message,
          status,
          sentAt: new Date(),
        });
      } catch (logErr) {
        console.error('Failed to log SMS notification:', logErr);
      }
    }

    results.push({ to: recipient, status, ...(status === 'failed' && { error: errorMessage }) });
  }

  res.json({
    success: true,
    message: 'SMS notification(s) processed',
    results,
  });
};

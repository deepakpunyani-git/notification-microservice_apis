import { query , body } from 'express-validator';

export const validateNotificationList = [
  query('site').notEmpty().withMessage('Site is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('sortBy').optional().isIn(['createdAt', 'sentAt']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be "asc" or "desc"'),
  query('status').optional().isIn(['sent', 'failed']).withMessage('Invalid status'),
];

export const validateEmailNotification = [
  body('site').notEmpty().withMessage('Site is required'),
  body('to')
    .notEmpty().withMessage('Recipient email(s) required')
    .custom((value) => {
      const emails = Array.isArray(value) ? value : [value];
      for (const email of emails) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid) throw new Error(`Invalid email: ${email}`);
      }
      return true;
    }),
  body('subject').optional().isString(),
  body('message').notEmpty().withMessage('Message is required'),
];

export const validateSMSNotification = [
  body('site').notEmpty().withMessage('Site is required'),
  body('to')
    .notEmpty().withMessage('Recipient phone number(s) required')
    .custom((value) => {
      const numbers = Array.isArray(value) ? value : [value];
      for (const number of numbers) {
        const isValid = /^[0-9]{10,15}$/.test(number);
        if (!isValid) throw new Error(`Invalid phone number: ${number}`);
      }
      return true;
    }),
  body('message').notEmpty().withMessage('Message is required'),
];
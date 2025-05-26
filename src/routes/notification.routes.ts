import express from 'express';
import { sendEmailNotification , sendSMSNotification , listEmailNotifications , listSMSNotifications } from '../controllers/notification.controller';
import { handleValidationErrors } from '../middlewares/validationErrorHandler';
import { validateNotificationList , validateEmailNotification ,validateSMSNotification } from '../validators/notificationValidator';

const router = express.Router();

router.post('/email', validateEmailNotification, handleValidationErrors,sendEmailNotification);
router.post('/sms', validateSMSNotification,handleValidationErrors,sendSMSNotification);
router.get('/email/list', validateNotificationList, handleValidationErrors, listEmailNotifications);
router.get('/sms/list', validateNotificationList, handleValidationErrors, listSMSNotifications);



export default router;

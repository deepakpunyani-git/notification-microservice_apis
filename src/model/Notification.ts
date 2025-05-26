import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  site: string;
  type: 'email' | 'sms';
  to: string;
  subject?: string; 
  message: string;
  status: 'sent' | 'failed';
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    site: { type: String, required: true },
    type: { type: String, enum: ['email', 'sms'], required: true },
    to: { type: String, required: true },
    subject: { type: String }, 
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'failed'], required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', notificationSchema);

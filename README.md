# Notification Microservice API

A lightweight microservice for sending and listing **Email** and **SMS** notifications via REST API.

## Features

- Send Email or SMS notifications
- List Email/SMS logs with filtering
- API key-based security
- Supports multiple recipients
- Optional logging of messages

## Tech Stack

- Node.js
- Express
- TypeScript or JavaScript
- MongoDB (if logging is enabled)

# for development
npm run dev

# for production
npm run start



# .env file variables

MONGODB_URI=
PORT=
API_KEY=


EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

CLIENT_URL=http://localhost:5173,http://localhost:3000/
FAST2SMS_API_KEY =
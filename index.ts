import dotenv from 'dotenv';
import connectDB from './src/config/db';
import app from './src/app';

dotenv.config();

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port - ${PORT}`);
    });
  })
.catch((err: unknown) => {
  console.error('DB connection error:', err);
});

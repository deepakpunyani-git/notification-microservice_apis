import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


const swaggerPath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);
dotenv.config();

const app = express();

const API_KEY = process.env.API_KEY || '';

const allowedSites = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);


app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Site'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const verifyApiKeyAndSite = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.replace('Bearer ', '');

  const site = req.headers['site'] || req.body?.site || req.query?.site;

  if (!site) {
    res.status(400).json({ error: 'Site is required' });
    return;
  }

  if (!token || token !== API_KEY) {
    res.status(403).json({ error: 'Forbidden: Invalid API key' });
    return;
  }

  if (!allowedSites.includes(site)) {
    res.status(403).json({ error: 'Forbidden: Invalid or missing site' });
    return;
  }

  next();
};
app.use('/api/notifications', verifyApiKeyAndSite, notificationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Notification API is running');
});

export default app;

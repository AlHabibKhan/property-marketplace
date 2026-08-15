import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import propertiesRouter from './routes/properties.js';
import offersRouter from './routes/offers.js';
import locationsRouter from './routes/locations.js';
import requirementsRouter from './routes/requirements.js';
import identityRouter from './routes/identity.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/properties', propertiesRouter);
app.use('/api/offers', offersRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/requirements', requirementsRouter);
app.use('/api/identity', identityRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;

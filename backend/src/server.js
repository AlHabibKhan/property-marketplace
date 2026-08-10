import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import propertiesRouter from './routes/properties.js';
import offersRouter from './routes/offers.js';
import locationsRouter from './routes/locations.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/properties', propertiesRouter);
app.use('/api/offers', offersRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
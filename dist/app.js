import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDb from './db/connectToDb.js';
import lessonRoutes from './routes/lesson.js';
import authRoutes from './routes/auth.js';
import messageRoute from './routes/message.js';
dotenv.config();
let FE_RENDER;
const app = express();
app.use(cors({
  origin: process.env.FE_URL || FE_RENDER,
  credentials: true
}));
app.use(express.json());
app.use('/api/lessons', lessonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoute);
const PORT = process.env.PORT || 3000;
connectToDb().then(() => {
  app.listen(PORT, () => console.log(`App listening at port ${PORT} `));
  console.log('cors wating for requests from: ', FE_RENDER);
});
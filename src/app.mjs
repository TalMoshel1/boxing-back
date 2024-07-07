import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDb from './db/connectToDb.js';
import lessonRoutes from './routes/lesson.js';
import authRoutes from './routes/auth.js';
import messageRoute from './routes/message.js'

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3001', 'https://boxing-front.onrender.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/lessons', lessonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoute);

const PORT = process.env.PORT || 3000;

connectToDb().then(() => {
  app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
  console.log('CORS is waiting for requests from: ', allowedOrigins.join(', '));
});

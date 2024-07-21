import express from 'express';
import {authenticateToken} from '../middlewares/auth.js';
import * as lessonController from '../controllers/lesson.js';

const router = express.Router();

router.post('/group', lessonController.createLesson);

router.post('/requestPrivateLesson', lessonController.requestPrivateLesson);

router.post('/days', lessonController.getDaysLessons)

router.put('/approveLink/:lessonId', authenticateToken, lessonController.approvePrivateLesson)

router.put('/:lessonId,', authenticateToken, lessonController.updateLesson);

router.delete('/:lessonId', authenticateToken, lessonController.deleteLesson);

router.post('/week', lessonController.getWeeklyLessons);

router.post('/day', lessonController.getDayLessons)

export default router;

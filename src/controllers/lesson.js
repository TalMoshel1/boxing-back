import * as lessonService from '../services/lesson-service.js';
import { ObjectId } from 'mongodb';

export async function createLesson(req, res) {
  const { name, trainer, description, day, startTime, endTime, repeatsWeekly, repeatEndDate } = req.body;
  const lessonData = { name, trainer, description, day: new Date(day), startTime, endTime, repeatsWeekly, type: 'group', isApproved: true };

  try {
    if (!(name && trainer && day && startTime && endTime)) {
      return res.status(400).json({ message: 'Fill in all required fields' });
    }

    let createdLesson;
    let additionalLessons = [];

    if (repeatsWeekly) {
      const repeatedIndex = new ObjectId(); 
      additionalLessons = await lessonService.createWeeklyLessons({ ...lessonData, repeatedIndex }, new Date(repeatEndDate));
      createdLesson = await lessonService.createLesson({ ...lessonData, repeatedIndex });
    } else {
      createdLesson = await lessonService.createLesson(lessonData);
    }

    if (repeatsWeekly) {
      return res.status(201).json([createdLesson, ...additionalLessons]);
    }

    res.status(201).json(createdLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function requestPrivateLesson(req,res) {
  const { day, startTime, endTime, studentName, studentPhone, studentMail } = req.body;
  const lessonData = {day, startTime, endTime, studentName, studentPhone, studentMail}

  if (!( day && startTime && endTime && studentName && studentPhone && studentMail)) {
    return res.status(400).json({ message: 'Fill in all required fields' });
  }
  const createRequest = await lessonService.createLesson(lessonData);

  return res.status(201).json(createRequest)

}

export async function getWeeklyLessons(req, res) {
  const { startOfWeek } = req.body;

  try {
    const lessons = await lessonService.getLessonsForWeek(new Date(startOfWeek));
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateLesson(req, res) {
  const { lessonId } = req.params;
  const updatedLessonData = req.body;
  try {
    const updatedLesson = await lessonService.updateLesson(lessonId, updatedLessonData);
    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteLesson(req, res) {
  const { lessonId } = req.params;
  const { deleteAll } = req.body; 

  try {
    await lessonService.deleteLesson(lessonId, deleteAll);
    res.status(200).json({ message: `${deleteAll? 'Lessons': 'Lesson'} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


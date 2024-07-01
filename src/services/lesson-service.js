import { Lesson } from '../models/lesson.js';
import { ObjectId } from 'mongodb'; // Import ObjectId

export async function createLesson(lessonData) {
  try {
    const lesson = new Lesson(lessonData);
    const savedLesson = await lesson.save();
    return savedLesson;
  } catch (error) {
    throw new Error('Could not create lesson');
  }
}

export async function createWeeklyLessons(lessonData, repeatEndDate) {
  const createdLessons = [];
  let currentLessonDate = new Date(lessonData.day);
  const repeatedIndex = lessonData.repeatedIndex || new ObjectId(); 

  if (!(repeatEndDate instanceof Date) || isNaN(repeatEndDate)) {
    throw new Error('Invalid repeatEndDate');
  }

  // Skip the initial lesson day
  currentLessonDate.setDate(currentLessonDate.getDate() + 7);

  while (currentLessonDate <= repeatEndDate) {
    const lesson = { ...lessonData, day: new Date(currentLessonDate), repeatedIndex };
    const createdLesson = new Lesson(lesson);
    await createdLesson.save();
    createdLessons.push(createdLesson);

    currentLessonDate.setDate(currentLessonDate.getDate() + 7);
  }

  return createdLessons;
}

export async function updateLesson(id, updatedLessonData) {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(id, updatedLessonData, { new: true });
    return updatedLesson;
  } catch (error) {
    throw new Error('Could not update lesson');
  }
}
export async function deleteLesson(lessonId, deleteAll) {
  try {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new Error('Lesson not found');
    }


    if (deleteAll) {
      await Lesson.deleteMany({
        repeatedIndex: lesson.repeatedIndex, 
      });
    } else {
      await Lesson.findByIdAndDelete(lessonId);
    }
  } catch (error) {
    throw new Error('Could not delete lesson');
  }
}

export async function getLessonsForWeek(startOfWeek) {
  try {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const lessons = await Lesson.find({
      day: { $gte: startOfWeek, $lte: endOfWeek }
    });

    return lessons;
  } catch (error) {
    throw new Error('Could not fetch lessons for the week');
  }
}


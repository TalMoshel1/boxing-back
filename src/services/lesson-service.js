import { Lesson } from '../models/lesson.js';
import { ObjectId } from 'mongodb'; // Import ObjectId

export async function createLesson(lessonData) {
  try {
    const { day, startTime } = lessonData;
    
    const existingLesson = await Lesson.findOne({ day: day, startTime: startTime });
    
    if (existingLesson) {
      throw new Error('שיעור כבר קבוע בשעה ויום זה');
    }
    
    const lesson = new Lesson(lessonData);
    const savedLesson = await lesson.save();
    return savedLesson;
  } catch (error) {
    if (error.message === 'שיעור כבר קבוע בשעה ויום זה') {
      throw error;
    } else {
      throw new Error('Could not create lesson');
    }
  }
}


export async function createWeeklyLessons(lessonData, repeatEndDate) {
  const createdLessons = [];
  let currentLessonDate = new Date(lessonData.day);
  const repeatedIndex = lessonData.repeatedIndex || new ObjectId(); 

  if (!(repeatEndDate instanceof Date) || isNaN(repeatEndDate)) {
    throw new Error('Invalid repeatEndDate');
  }

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

export async function checkRepeatedLesson(lessonData, repeatEndDate) {
  const lessonDayOfWeek = new Date(lessonData.day).toLocaleString('en-us', { weekday: 'short' });
  const startTime = lessonData.startTime;
  const endTime = lessonData.endTime;

  if (repeatEndDate) {
    const existingLesson = await Lesson.findOne({
      dayOfWeek: lessonDayOfWeek,
      startTime,
      endTime,
      day: { $gte: lessonData.day, $lte: repeatEndDate }
    });
  
    return existingLesson;
  }

  const existingLesson = await Lesson.findOne({
    dayOfWeek: lessonData.day,
    startTime,
    endTime
  });

  return existingLesson;


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
    console.log(error)
    throw new Error('Could not delete lesson');
  }
}

export async function getLessonsForWeek(startOfWeek) {
  if (!(startOfWeek instanceof Date)) {
    startOfWeek = new Date(startOfWeek);
  }


  try {
    // Create endOfWeek based on startOfWeek
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Log the computed endOfWeek

    // Ensure both startOfWeek and endOfWeek are in UTC
    const startOfWeekUTC = new Date(Date.UTC(
      startOfWeek.getFullYear(), 
      startOfWeek.getMonth(), 
      startOfWeek.getDate()
    ));
    const endOfWeekUTC = new Date(Date.UTC(
      endOfWeek.getFullYear(), 
      endOfWeek.getMonth(), 
      endOfWeek.getDate()
    ));

    // Log UTC dates


    // Fetch lessons within the week range
    const lessons = await Lesson.find({
      day: { $gte: startOfWeekUTC, $lte: endOfWeekUTC }
    });

    // Log the lessons fetched

    return lessons;
  } catch (error) {
    console.log('service error: ', error);
    throw new Error('Could not fetch lessons for the week');
  }
}



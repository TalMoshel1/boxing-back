function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import { Lesson } from '../models/lesson.js';
import { ObjectId } from 'mongodb'; // Import ObjectId

export function createLesson(_x) {
  return _createLesson.apply(this, arguments);
}
function _createLesson() {
  _createLesson = _asyncToGenerator(function* (lessonData) {
    try {
      const lesson = new Lesson(lessonData);
      const savedLesson = yield lesson.save();
      return savedLesson;
    } catch (error) {
      throw new Error('Could not create lesson');
    }
  });
  return _createLesson.apply(this, arguments);
}
export function createWeeklyLessons(_x2, _x3) {
  return _createWeeklyLessons.apply(this, arguments);
}
function _createWeeklyLessons() {
  _createWeeklyLessons = _asyncToGenerator(function* (lessonData, repeatEndDate) {
    const createdLessons = [];
    let currentLessonDate = new Date(lessonData.day);
    const repeatedIndex = lessonData.repeatedIndex || new ObjectId();
    if (!(repeatEndDate instanceof Date) || isNaN(repeatEndDate)) {
      throw new Error('Invalid repeatEndDate');
    }

    // Skip the initial lesson day
    currentLessonDate.setDate(currentLessonDate.getDate() + 7);
    while (currentLessonDate <= repeatEndDate) {
      const lesson = _objectSpread(_objectSpread({}, lessonData), {}, {
        day: new Date(currentLessonDate),
        repeatedIndex
      });
      const createdLesson = new Lesson(lesson);
      yield createdLesson.save();
      createdLessons.push(createdLesson);
      currentLessonDate.setDate(currentLessonDate.getDate() + 7);
    }
    return createdLessons;
  });
  return _createWeeklyLessons.apply(this, arguments);
}
export function updateLesson(_x4, _x5) {
  return _updateLesson.apply(this, arguments);
}
function _updateLesson() {
  _updateLesson = _asyncToGenerator(function* (id, updatedLessonData) {
    try {
      const updatedLesson = yield Lesson.findByIdAndUpdate(id, updatedLessonData, {
        new: true
      });
      return updatedLesson;
    } catch (error) {
      throw new Error('Could not update lesson');
    }
  });
  return _updateLesson.apply(this, arguments);
}
export function deleteLesson(_x6, _x7) {
  return _deleteLesson.apply(this, arguments);
}
function _deleteLesson() {
  _deleteLesson = _asyncToGenerator(function* (lessonId, deleteAll) {
    try {
      const lesson = yield Lesson.findById(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      if (deleteAll) {
        yield Lesson.deleteMany({
          repeatedIndex: lesson.repeatedIndex
        });
      } else {
        yield Lesson.findByIdAndDelete(lessonId);
      }
    } catch (error) {
      throw new Error('Could not delete lesson');
    }
  });
  return _deleteLesson.apply(this, arguments);
}
export function getLessonsForWeek(_x8) {
  return _getLessonsForWeek.apply(this, arguments);
}
function _getLessonsForWeek() {
  _getLessonsForWeek = _asyncToGenerator(function* (startOfWeek) {
    try {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const lessons = yield Lesson.find({
        day: {
          $gte: startOfWeek,
          $lte: endOfWeek
        }
      });
      return lessons;
    } catch (error) {
      throw new Error('Could not fetch lessons for the week');
    }
  });
  return _getLessonsForWeek.apply(this, arguments);
}
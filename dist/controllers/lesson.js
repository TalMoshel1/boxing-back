function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import * as lessonService from '../services/lesson-service.js';
import { ObjectId } from 'mongodb';
export function createLesson(_x, _x2) {
  return _createLesson.apply(this, arguments);
}
function _createLesson() {
  _createLesson = _asyncToGenerator(function* (req, res) {
    const {
      name,
      trainer,
      description,
      day,
      startTime,
      endTime,
      repeatsWeekly,
      repeatEndDate
    } = req.body;
    const lessonData = {
      name,
      trainer,
      description,
      day: new Date(day),
      startTime,
      endTime,
      repeatsWeekly,
      type: 'group',
      isApproved: true
    };
    try {
      if (!(name && trainer && day && startTime && endTime)) {
        return res.status(400).json({
          message: 'Fill in all required fields'
        });
      }
      let createdLesson;
      let additionalLessons = [];
      if (repeatsWeekly) {
        const repeatedIndex = new ObjectId();
        additionalLessons = yield lessonService.createWeeklyLessons(_objectSpread(_objectSpread({}, lessonData), {}, {
          repeatedIndex
        }), new Date(repeatEndDate));
        createdLesson = yield lessonService.createLesson(_objectSpread(_objectSpread({}, lessonData), {}, {
          repeatedIndex
        }));
      } else {
        createdLesson = yield lessonService.createLesson(lessonData);
      }
      if (repeatsWeekly) {
        return res.status(201).json([createdLesson, ...additionalLessons]);
      }
      res.status(201).json(createdLesson);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  return _createLesson.apply(this, arguments);
}
export function requestPrivateLesson(_x3, _x4) {
  return _requestPrivateLesson.apply(this, arguments);
}
function _requestPrivateLesson() {
  _requestPrivateLesson = _asyncToGenerator(function* (req, res) {
    const {
      day,
      startTime,
      endTime,
      studentName,
      studentPhone,
      studentMail
    } = req.body;
    const lessonData = {
      day,
      startTime,
      endTime,
      studentName,
      studentPhone,
      studentMail
    };
    if (!(day && startTime && endTime && studentName && studentPhone && studentMail)) {
      return res.status(400).json({
        message: 'Fill in all required fields'
      });
    }
    const createRequest = yield lessonService.createLesson(lessonData);
    return res.status(201).json(createRequest);
  });
  return _requestPrivateLesson.apply(this, arguments);
}
export function getWeeklyLessons(_x5, _x6) {
  return _getWeeklyLessons.apply(this, arguments);
}
function _getWeeklyLessons() {
  _getWeeklyLessons = _asyncToGenerator(function* (req, res) {
    const {
      startOfWeek
    } = req.body;
    try {
      const lessons = yield lessonService.getLessonsForWeek(new Date(startOfWeek));
      res.status(200).json(lessons);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  return _getWeeklyLessons.apply(this, arguments);
}
export function updateLesson(_x7, _x8) {
  return _updateLesson.apply(this, arguments);
}
function _updateLesson() {
  _updateLesson = _asyncToGenerator(function* (req, res) {
    const {
      lessonId
    } = req.params;
    const updatedLessonData = req.body;
    try {
      const updatedLesson = yield lessonService.updateLesson(lessonId, updatedLessonData);
      if (!updatedLesson) {
        return res.status(404).json({
          message: 'Lesson not found'
        });
      }
      res.status(200).json(updatedLesson);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  return _updateLesson.apply(this, arguments);
}
export function deleteLesson(_x9, _x10) {
  return _deleteLesson.apply(this, arguments);
}
function _deleteLesson() {
  _deleteLesson = _asyncToGenerator(function* (req, res) {
    const {
      lessonId
    } = req.params;
    const {
      deleteAll
    } = req.body;
    try {
      yield lessonService.deleteLesson(lessonId, deleteAll);
      res.status(200).json({
        message: `${deleteAll ? 'Lessons' : 'Lesson'} deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });
  return _deleteLesson.apply(this, arguments);
}
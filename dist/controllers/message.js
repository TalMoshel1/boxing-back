function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import { messageService } from '../services/message.js';
export function sendMessageToAdmin(_x, _x2) {
  return _sendMessageToAdmin.apply(this, arguments);
}
function _sendMessageToAdmin() {
  _sendMessageToAdmin = _asyncToGenerator(function* (req, res) {
    const {
      name,
      email,
      subject,
      message,
      to
    } = req.body;
    if (!(name && email && subject && message && to)) {
      return res.status(400).json({
        message: 'Fill in all required fields'
      });
    }
    try {
      const newMessage = yield messageService(name, email, subject, message, to);
      return res.status(200).json(newMessage);
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  });
  return _sendMessageToAdmin.apply(this, arguments);
}
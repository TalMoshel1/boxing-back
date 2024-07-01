function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import bcrypt from 'bcrypt';
export function hashPassword(_x) {
  return _hashPassword.apply(this, arguments);
}
function _hashPassword() {
  _hashPassword = _asyncToGenerator(function* (password) {
    try {
      const saltRounds = 10;
      const salt = yield bcrypt.genSalt(saltRounds);
      const hashedPassword = yield bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
    }
  });
  return _hashPassword.apply(this, arguments);
}
;
export function comparePassword(_x2, _x3) {
  return _comparePassword.apply(this, arguments);
}
function _comparePassword() {
  _comparePassword = _asyncToGenerator(function* (plainPassword, hashedPassword) {
    try {
      const match = yield bcrypt.compare(plainPassword, hashedPassword);
      return match;
    } catch (err) {
      console.error('Error comparing password:', err);
      throw err;
    }
  });
  return _comparePassword.apply(this, arguments);
}
;
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { comparePassword } from '../functions/password.js';
export function serviceSignIn(_x, _x2) {
  return _serviceSignIn.apply(this, arguments);
}
function _serviceSignIn() {
  _serviceSignIn = _asyncToGenerator(function* (email, password) {
    try {
      const user = yield User.findOne({
        email
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = yield comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const token = getToken(user);
      return token;
    } catch (error) {
      console.error('Error in service SignIn:', error.message);
      throw new Error('Authentication failed');
    }
  });
  return _serviceSignIn.apply(this, arguments);
}
function getToken(user) {
  const token = jwt.sign({
    userId: user._id
  }, process.env.JWT_Secret_Key, {
    expiresIn: '1w'
  });
  return token;
}
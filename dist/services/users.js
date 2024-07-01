function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import { User } from '../models/user.js';
import { hashPassword } from '../functions/password.js';
export function findUser(_x) {
  return _findUser.apply(this, arguments);
}
function _findUser() {
  _findUser = _asyncToGenerator(function* (phone) {
    const user = User.findone({
      phone
    });
    if (!user) return res.status(400).json({
      message: 'User not found'
    });
  });
  return _findUser.apply(this, arguments);
}
export function updateUser() {
  return _updateUser.apply(this, arguments);
}
function _updateUser() {
  _updateUser = _asyncToGenerator(function* () {});
  return _updateUser.apply(this, arguments);
}
export function createUser(_x2, _x3, _x4, _x5, _x6) {
  return _createUser.apply(this, arguments);
}
function _createUser() {
  _createUser = _asyncToGenerator(function* (username, password, phone, role, email) {
    try {
      const hashedPassword = yield hashPassword(password);
      const newUser = new User({
        username,
        password: hashedPassword,
        phone,
        role,
        email
      });
      const savedUser = yield newUser.save();
      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.hashedPassword;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Could not create user');
    }
  });
  return _createUser.apply(this, arguments);
}
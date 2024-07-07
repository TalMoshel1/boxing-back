function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import { serviceSignIn } from "../services/auth.js";
import { createUser } from "../services/users.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import { messageService } from "../services/message.js";
export function registration(_x, _x2) {
  return _registration.apply(this, arguments);
}
function _registration() {
  _registration = _asyncToGenerator(function* (req, res) {
    const {
      username,
      password,
      phone,
      email
    } = req.body;
    try {
      let role = "regular";
      const adminPhoneNumbers = ["0502323574"];
      if (adminPhoneNumbers.includes(phone)) {
        role = "admin";
      }
      if (username && password && phone && email) {
        const createdUser = yield createUser(username, password, phone, role, email);
        return res.status(201).json(createdUser);
      } else {
        return res.status(400).json({
          message: "Invalid parameters provided"
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        message: "Error creating user",
        error: error.message
      });
    }
  });
  return _registration.apply(this, arguments);
}
export function signIn(_x3, _x4) {
  return _signIn.apply(this, arguments);
}
function _signIn() {
  _signIn = _asyncToGenerator(function* (req, res) {
    try {
      const {
        email,
        password
      } = req.body;
      const token = yield serviceSignIn(email, password);
      res.json({
        token
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  });
  return _signIn.apply(this, arguments);
}
export function forgotPasswordPhone(_x5, _x6) {
  return _forgotPasswordPhone.apply(this, arguments);
}
function _forgotPasswordPhone() {
  _forgotPasswordPhone = _asyncToGenerator(function* (req, res) {
    const {
      email
    } = req.body;
    try {
      const user = yield User.findOne({
        email
      });
      if (!user) return res.status(400).json({
        message: "User not found"
      });
      const code = crypto.randomInt(100000, 999999).toString();
      user.resetPasswordToken = code;
      user.resetPasswordExpires = Date.now() + 3600000;
      yield user.save();
      yield messageService(user.username, process.env.ADMIN_MAIL_ADDRESS, "לחיצה על הלינק והכנסת הקוד המצורף יאפשרו איפוס סיסמה. בעוד שעה הקוד יפוג מתוקפו", code, user.email);
      res.status(200).json({
        body: `נשלח קוד עבור איפוס סיסמה למייל שצורף`
      });
    } catch (err) {
      console.error("Error sending WhatsApp message", err);
      res.status(500).json({
        message: "Failed to send WhatsApp message"
      });
    }
  });
  return _forgotPasswordPhone.apply(this, arguments);
}
export function resetPasswordPhone(_x7, _x8) {
  return _resetPasswordPhone.apply(this, arguments);
}
function _resetPasswordPhone() {
  _resetPasswordPhone = _asyncToGenerator(function* (req, res) {
    const {
      phone,
      code,
      newPassword
    } = req.body;
    try {
      const user = yield User.findOne({
        phone,
        resetPasswordToken: code,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      });
      if (!user) return res.status(400).json({
        message: "Invalid code or code expired"
      });
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      yield user.save();
      res.status(200).json({
        message: "Password has been reset"
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({
        message: "Error resetting password",
        error: error.message
      });
    }
  });
  return _resetPasswordPhone.apply(this, arguments);
}
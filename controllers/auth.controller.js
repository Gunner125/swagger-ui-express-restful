const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customerModel = require('../models/customer.model');
const msgConstant = require("../constant/message.mapping");
const respConvert = require("../utils/response.converter");
const utils = require('../utils/string');

exports.signin = async (req, res) => {
      return new Promise(function (resolve, reject) {
            (async () => {
                  const { username, password } = req.body;

                  const user = await customerModel.findOne({ username: username }, 'username password role');

                  if (!user) return reject(msgConstant.customer.user_not_found);

                  const passwordIsValid = utils.comparePassword(password, user.password);

                  if (!passwordIsValid) return reject(msgConstant.customer.invalid_password);

                  const accessToken = jwt.sign({ _id: user._id, username: user.username, role: user.role }, "123456789_SECRET", {
                        expiresIn: '3h',
                  });

                  const refreshToken = jwt.sign({ _id: user._id, username: user.username, role: user.role }, "123456789_SECRET", {
                        expiresIn: '8h',
                  });

                  res.cookie('accessToken', accessToken, { httpOnly: true });
                  res.cookie('refreshToken', refreshToken, { httpOnly: true });

                  resolve(respConvert.successWithData(msgConstant.auth.login_success, { accessTooken: accessToken }));
            })().catch((err) => {
                  console.error('[error on catch] : ' + err);
                  reject(respConvert.systemError(err));
            });
      });
};


exports.signout = (req, res) => {
      return new Promise((resolve, reject) => {
            (async () => {
                  res.clearCookie("accessToken");
                  res.clearCookie("refreshToken");
                  resolve(respConvert.success(msgConstant.auth.logout_success));
            })().catch(function (err) {
                  console.error('[error on catch] : ' + err);
                  reject(respConvert.systemError(err));
            });
      });
};
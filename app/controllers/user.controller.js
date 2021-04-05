'use strict';

const userModel = require('../models/user.model');
const { userSchema, loginSchema } = require('../../middleware/joi/validation.schema');
const { createToken } = require('../../middleware/jwt/jwt');
const common = require('../common/common');
const bcrypt = require('bcrypt');

// route '/api/v1/aws-training-management-system/user/register'
exports.registerUser = async (req, res) => {
  const { aws_email, password, last_name, first_name, dev } = req.body;
  bcrypt.hash(password, 10).then(async (hashedPassword) => {
    try {
      await userSchema.validateAsync(req.body);
      const user = {
        aws_email: aws_email,
        password: hashedPassword,
        last_name: last_name,
        first_name: first_name,
        dev: dev,
      };
      let userDbResult = await userModel.addUser(user);
      if (userDbResult.affectedRows > 0) {
        return res.status(200).json({ registered: '1' });
      } else {
        return res.status(200).json({ registered: '0' });
      }
    } catch (err) {
      common.errorHandler(err, (status_code, error_message) => {
        return res.status(status_code).json({ error_message: error_message });
      });
    }
  });
};

// route '/api/v1/aws-training-management-system/user/login'
exports.loginUser = async (req, res) => {
  try {
    await loginSchema.validateAsync(req.body);
    const { aws_email, password } = req.body;
    let user = await userModel.getUserByEmail(aws_email);
    if (user.length < 0) {
      return res.status(400).json({ error_message: 'invalid username/password' });
    }
    bcrypt.compare(password, user[0].password).then(async (match) => {
      if (!match) {
        return res.status(400).json({ error_message: 'invalid username/password' });
      } else {
        const accessToken = await createToken(user);
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 60 * 60 * 24 });
        return res.json({ login: '1' });
      }
    });
  } catch (err) {
    common.errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/user/logout'
exports.logoutUser = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.status(200).json({ logout: '1' });
  } catch (err) {
    common.errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

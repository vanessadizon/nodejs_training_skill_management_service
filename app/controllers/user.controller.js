'use strict';

const userModel = require('../models/user.model');
const { registerUserSchema, loginUserSchema, idSchema } = require('../utils/validation');
const bcrypt = require('bcryptjs');
const {
    AuthenticationError,
    errorHandling,
    ValidationError,
    EntityNotFoundError,
} = require('../common/common');
const { createToken, signRefreshToken, verifyRefreshToken } = require('../../middleware/jwt/jwt');
const client = require('../../middleware/redis/redis');

// route '/api/v1/aws-training-management-system/user/register'
exports.register = async (req, res) => {
    try {
        const userSchemaValidation = registerUserSchema.validate(req.body);
        if (userSchemaValidation.error) throw new ValidationError(userSchemaValidation.error);
        await userModel.addNewUser(req.body);
        return res.status(200).json({ added: '1' });
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/user/login'
exports.login = async (req, res) => {
    try {
        const userSchemaValidation = loginUserSchema.validate(req.body);
        if (userSchemaValidation.error) throw new ValidationError(userSchemaValidation.error);
        const { aws_email, password } = req.body;
        const userDBResult = await userModel.getUserByAwsEmail(aws_email);
        if (!userDBResult.length) {
            throw new AuthenticationError('invalid email/password');
        }
        const user = userDBResult[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new AuthenticationError('invalid email/password');
        const accessToken = await createToken(user.aws_email);
        const refreshToken = await signRefreshToken(user.aws_email);
        return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/user/:user_id'
exports.updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const userIdValidation = idSchema.validate(user_id);
        if (userIdValidation.error) throw new ValidationError('user_id must be numeric');
        const userSchemaValidation = registerUserSchema.validate(req.body);
        if (userSchemaValidation.error) throw new ValidationError(userSchemaValidation.error);
        const skillDbResult = await userModel.updateUser(req.body, user_id);
        return res.status(200).json({ updated: '1' });
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/user/:user_id'
exports.deleteUserByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(user_id);
        const userIdValidation = idSchema.validate(user_id);
        if (userIdValidation.error) throw new ValidationError('user_id must be numeric');
        const userDbResult = await userModel.deleteUserByUserId(user_id);
        if (userDbResult.affectedRows <= 0)
            throw new EntityNotFoundError(`User with user_id: ${user_id} does not exists`);
        return res.status(200).json({ deleted: '1' });
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/user/:user_id'
exports.getUserByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const userIdValidation = idSchema.validate(user_id);
        if (userIdValidation.error) throw new ValidationError('user_id must be numeric');
        const userDbResult = await userModel.getUserByUserId(user_id);
        if (userDbResult.length > 0) {
            return res.status(200).json(userDbResult[0]);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};


// route '/api/v1/aws-training-management-system/user/all'
exports.getAllUsers = async (req, res) => {
    try {
        const userDbResult = await userModel.getAllUsers();
        return res.status(200).json(userDbResult);
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/user/logout'
exports.logout = async (req, res) => {
    try {
       const { refreshToken } = req.body;
       if(!refreshToken) throw new Error();
       const email =  await verifyRefreshToken(refreshToken);
       client.DEL(userId, (err, value) => {
           if (err) {
               console.log(err.message);
               throw new Error();
           }
           console.log(value);
           res.status(204).json("Successfully Logout user")
       })

    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/user/logout'
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if(!refreshToken) throw new Error();
        const email = await verifyRefreshToken(refreshToken);
        const accessToken = await createToken(user.aws_email);
        const refToken = await signRefreshToken(user.aws_email); 
        res.status(200).json({accessToken: accessToken, refreshToken: refToken});
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ error_message: error_message });
        });
    }
};


 

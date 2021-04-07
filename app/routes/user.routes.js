'use strict';

// Load the 'user' controller
const userController = require('../controllers/user.controller');
const passport = require('passport');
const { loggedIn } = require('../../middleware/passport/passport')

module.exports = function (app) {
    /**
     * @swagger
     * /api/v1/aws-training-management-system/user/register:
     *  post:
     *   tags:
     *     - User API
     *   description: Able to add new User.
     *   parameters:
     *     - in: body
     *       name: body
     *       description: user details
     *       required: true
     *       schema:
     *         $ref: "#/definitions/User"
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: { "addded": "1"}
     *     409:
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Duplicate entry." }
     *     503:
     *       description: 3.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     * 
     * definitions:
     *   User:
     *    type: object
     *    properties:
     *      aws_email:
     *        type: string
     *      password:
     *        type: string
     *      first_name:
     *        type: string
     *      last_name:
     *        type: string
     *      dev:
     *        type: string
     *    example:
     *      aws_email: "gerardojr.abantao@awsys-i.com"
     *      password: "password"
     *      first_name: "Gerardo Jr."
     *      last_name: "Abantao"
     *      dev: "B"
     */
    app.route('/api/v1/aws-training-management-system/user/register').post(userController.register);
    
     /**
     * @swagger
     * /api/v1/aws-training-management-system/user/login:
     *  post:
     *   tags:
     *     - User API
     *   description: Able to authenticate User.
     *   parameters:
     *     - in: body
     *       name: body
     *       description: user credentials aws_email and password
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           aws_email: 
     *             type: string
     *           password: 
     *             type: string
     *         example:
     *           aws_email: "gerardojr.abantao@awsys-i.com"
     *           password: "password_123"
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: { "token": "Bearer + <token>"}
     *     401:
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "invalid email/password" }
     *     503:
     *       description: 3.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     * 
     */
    app.route('/api/v1/aws-training-management-system/user/login').post(userController.login);

    /**
     * @swagger
     * /api/v1/aws-training-management-system/user/{user_id}:
     *  put:
     *   tags:
     *     - User API
     *   description: Able to update User.
     *   parameters:
     *     - in: path
     *       name: user_id
     *       schema:
     *         type: integer
     *       required: true
     *     - in: body
     *       name: body
     *       description: user details
     *       required: true
     *       schema:
     *         $ref: "#/definitions/User"
     *   security:
     *     - Bearer: []
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: { "updated": "1"}
     *     409:
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Duplicate entry." }
     *     503:
     *       description: 3.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     * schemes:
     *   - http
     *   - https
     * securityDefinitions:
     *   Bearer:
     *     type: apiKey
     *     name: Authorization
     *     in: header
     */
     app.route('/api/v1/aws-training-management-system/user/:user_id').put(passport.authenticate('jwt'), userController.updateUser);

     /**
     * @swagger
     * /api/v1/aws-training-management-system/user/{user_id}:
     *  delete:
     *   tags:
     *     - User API
     *   description: Able to delete User.
     *   parameters:
     *     - in: path
     *       name: user_id
     *       schema:
     *         type: integer
     *       required: true
     *   security:
     *     - Bearer: []
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: { "deleted": "1"}
     *     503:
     *       description: 3.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     *     401:
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error": "Unauthorized" }
     * schemes:
     *   - http
     *   - https
     * securityDefinitions:
     *   Bearer:
     *     type: apiKey
     *     name: Authorization
     *     in: header
     */
      app.route('/api/v1/aws-training-management-system/user/:user_id').delete(passport.authenticate('jwt'), userController.deleteUserByUserId);

    /**
     * @swagger
     * /api/v1/aws-training-management-system/user/id/{user_id}:
     *  get:
     *   tags:
     *     - User API
     *   description: Able to get User by userId.
     *   parameters:
     *     - in: path
     *       name: user_id
     *       schema:
     *         type: integer
     *       required: true
     *   security:
     *     - Bearer: []
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: { "aws_email": "gerardojr.abantao@awsys-i.com",
     *      "password": "password",
     *      "first_name": "Gerardo Jr.",
     *      "last_name": "Abantao",
     *      "dev": "B"}
     *     503:
     *       description: 3.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     *     401:
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error": "Unauthorized" }
     * schemes:
     *   - http
     *   - https
     * securityDefinitions:
     *   Bearer:
     *     type: apiKey
     *     name: Authorization
     *     in: header
     */
    app.route('/api/v1/aws-training-management-system/user/id/:user_id').get(passport.authenticate('jwt'), userController.getUserByUserId);

    /**
     * @swagger
     * /api/v1/aws-training-management-system/user/all:
     *  get:
     *   tags:
     *     - User API
     *   description: Able to get all users.
     *   security:
     *     - Bearer: []
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: [{ "aws_email": "gerardojr.abantao@awsys-i.com",
     *      "password": "password",
     *      "first_name": "Gerardo Jr.",
     *      "last_name": "Abantao",
     *      "dev": "B"}]
     *     503:
     *       description: 3.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     *     401:
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error": "Unauthorized" }
     * schemes:
     *   - http
     *   - https
     * securityDefinitions:
     *   Bearer:
     *     type: apiKey
     *     name: Authorization
     *     in: header
     */
    app.route('/api/v1/aws-training-management-system/user/all').get(passport.authenticate('jwt'), userController.getAllUsers);

    /**
     * @swagger
     * /api/v1/aws-training-management-system/user/logout:
     *  get:
     *   tags:
     *     - User API
     *   description: Able to logout User.
     *   parameters:
     *     - in: body
     *       name: body
     *       description: refreshToken
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           refreshToken: 
     *             type: string
     *         example:
     *           refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdlcmFyZG9qci5hYmFudGFvQGF3c3lzLWkuY29tIiwiaWF0IjoxNjE3Njk2MDgyLCJleHAiOjE2MjAyODgwODJ9.FwS22anZYEI74pfmn_L0zSO0eLgyN9jd71njlZu79ck"
     *   security:
     *     - Bearer: []
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: { "message": "Successfully logout user"}
     * securityDefinitions:
     *   Bearer:
     *     type: apiKey
     *     name: Authorization
     *     in: header 
     */
    app.route('/api/v1/aws-training-management-system/user/logout').delete(passport.authenticate('jwt'), userController.logout);

    /**
     * @swagger
     * /api/v1/aws-training-management-system/user/logout:
     *  get:
     *   tags:
     *     - User API
     *   description: Refresh token
     *   parameters:
     *     - in: body
     *       name: body
     *       description: refreshToken
     *       required: true
     *       schema:
     *         type: object
     *         properties:
     *           refreshToken: 
     *             type: string
     *         example:
     *           refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdlcmFyZG9qci5hYmFudGFvQGF3c3lzLWkuY29tIiwiaWF0IjoxNjE3Njk2MDgyLCJleHAiOjE2MjAyODgwODJ9.FwS22anZYEI74pfmn_L0zSO0eLgyN9jd71njlZu79ck"
     *   security:
     *     - Bearer: []
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: { "message": "Successfully logout user"}
     * securityDefinitions:
     *   Bearer:
     *     type: apiKey
     *     name: Authorization
     *     in: header 
     */
       app.route('/api/v1/aws-training-management-system/user/refresh-token').post(passport.authenticate('jwt'), userController.refreshToken);
};

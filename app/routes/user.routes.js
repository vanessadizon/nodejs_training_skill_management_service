"use strict";

// Load the 'user' controller
const userController = require("../controllers/user.controller");

// Define the routes module' method
module.exports = function (app) {
  /**
   * @swagger
   * /api/v1/aws-training-management-system/user/register:
   *  post:
   *   tags:
   *     - User API
   *   description: Able to add new user.
   *
   *   parameters:
   *     - in: body
   *       name: body
   *       schema:
   *         $ref: '#/definitions/User'
   *       required: true
   *       description: body
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "registered": "1"}
   *     409:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "User already exists." }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   * definitions:
   *   User:
   *     properties:
   *       aws_email:
   *         type: string
   *       password:
   *         type: string
   *       last_name:
   *         type: string
   *       first_name:
   *         type: string
   *       dev:
   *         type: string
   *     required:
   *       - aws_email
   *       - password
   *       - last_name
   *       - first_name
   *       - dev
   */
  app.route("/api/v1/aws-training-management-system/user/register").post(userController.registerUser);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/user/login:
   *  post:
   *   tags:
   *     - User API
   *   description: User login.
   *
   *   parameters:
   *     - in: body
   *       name: body
   *       schema:
   *         properties:
   *            aws_email:
   *              type: string
   *            password:
   *              type: string
   *       required: true
   *       description: body
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "login ": "1"}
   *     409:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "User doesnt exists." }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   */
  app.route("/api/v1/aws-training-management-system/user/login").post(userController.loginUser);
};

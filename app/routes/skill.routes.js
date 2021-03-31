'use strict';

// Load the 'skill' controller
const skillController = require('../controllers/skill.controller');

// Define the routes module' method
module.exports = function (app) {
   /**
    * @swagger
    * securityDefinitions:
    *   Bearer:
    *     type: apiKey
    *     name: Authorization
    *     in: header  
    * paths:
    *   /Authentication:
    *     get:
    *       security:
    *         - Bearer: []
    *       responses:
    *         '200':
    *           description: 'Will send `Authenticated`'
    *         '403': 
    *           description: 'You do not have necessary permissions for the resource'
    */

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/id/{skill_id}:
    *  get:
    *   tags:
    *     - Skill API
    *   description: Able to get skill details by skill ID.
    *   parameters:
    *     - in: path
    *       name: skill_id
    *       schema:
    *         type: integer
    *       required: true
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "skill_id": 2, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
    *                             "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    *   security:
    *     - Bearer: []
    */
   app.route('/api/v1/aws-training-management-system/skill/id/:skill_id')
      .get(skillController.getSkillBySkillId)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/allSkill:
    *  get:
    *   tags:
    *     - Skill API
    *   description: Able to get all the skills.
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "skill_id": 2, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
    *                             "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    *   security:
    *     - Bearer: []
    */
   app.route('/api/v1/aws-training-management-system/skill/allSkill')
      .get(skillController.getAllAvailableSkills)

   /**
    * @swagger
    * definitions:
    *    Skills:
    *       properties:
    *          skill_name:
    *             type: string
    *          skill_description:
    *             type: string
    *          references:
    *             type: array
    *             items:
    *                properties:
    *                   ref_link:
    *                      type: string
    *                   ref_category:
    *                      type: integer
    *                   length_in_mins:
    *                      type: integer
    *       required:
    *          - skill_name
    *          - ref_link
    */

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/addNewSkills:
    *  post:
    *   tags:
    *     - Skill API
    *   description: Able to add new skill.
    *   consumes:
    *     - application/json
    *   parameters:
    *     - in: body
    *       name: body
    *       schema:
    *          $ref: '#/definitions/Skills' 
    *       required: true
    *       description: body
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "added": "1" }
    *     409:
    *       description: 2.) return { error_message }
    *       examples:
    *          application/json: { "error_message": "Duplicate entry."}
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    *   security:
    *     - Bearer: []
    */
   app.route('/api/v1/aws-training-management-system/skill/addNewSkills')
      .post(skillController.addNewSkills)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/updateSkills/{skill_id}/{reference_id}:
    *  put:
    *   tags:
    *     - Skill API
    *   description: Able to update new skill.
    *   parameters:
    *     - in: path
    *       name: skill_id
    *       schema:
    *         type: integer
    *       required: true
    *     - in: path
    *       name: reference_id
    *       schema:
    *         type: integer
    *       required: true
    *     - in: body
    *       name: body
    *       schema:
    *          $ref: '#/definitions/Skills' 
    *       required: true
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "skill_id": 2, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
    *                             "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }
    *     409:
    *       description: 2.) return { error_message }
    *       examples:
    *          application/json: { "error_message": "Duplicate entry."}
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    *   security:
    *     - Bearer: []
    */
    app.route('/api/v1/aws-training-management-system/skill/updateSkills/:skill_id/:reference_id')
    .put(skillController.updateSkills)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/deleteSkills/id/{skill_id}:
    *  delete:
    *   tags:
    *     - Skill API
    *   description: Able to delete skill by skill ID.
    *   parameters:
    *     - in: path
    *       name: skill_id
    *       schema:
    *         type: integer
    *       required: true
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "deleted": 1 }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    *   security:
    *     - Bearer: []
    */
    app.route('/api/v1/aws-training-management-system/skill/deleteSkills/id/:skill_id')
      .delete(skillController.deleteSkills)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/user:
    *  get:
    *   tags:
    *     - User API
    *   description: Able to get all users.
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "user_id": 2, "aws_email": "admin.admin@awsys-i.com", "password": "admin", "last_name": "Admin", "first_name":"Admin", "dev": "B" }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    *   security:
    *     - Bearer: []
    */
    app.route('/api/v1/aws-training-management-system/user')
    .get(skillController.getUsers)

    /**
    * @swagger
    * /api/v1/aws-training-management-system/user/{aws_email}/{password}/{last_name}/{first_name}/{dev}:
    *  post:
    *   tags:
    *     - User API
    *   description: Able to add new user.
    *   parameters:
    *     - in: path
    *       name: aws_email
    *       schema:
    *         type: string
    *       required: true
    *     - in: path
    *       name: password
    *       schema:
    *         type: string
    *       required: true
    *     - in: path
    *       name: last_name
    *       schema:
    *         type: string
    *       required: true
    *     - in: path
    *       name: first_name
    *       schema:
    *         type: string
    *       required: true
    *     - in: path
    *       name: dev
    *       schema:
    *         type: string
    *       required: true
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "added": "1" }
    *     409:
    *       description: 2.) return { error_message }
    *       examples:
    *          application/json: { "error_message": "Duplicate entry."}
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    *   security:
    *     - Bearer: []
    */
     app.route('/api/v1/aws-training-management-system/user/:aws_email/:password/:last_name/:first_name/:dev')
     .post(skillController.addUser)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/user/login/{user_id}/{password}:
    *  post:
    *   tags:
    *     - User API
    *   description: Able to add new user.
    *   parameters:
    *     - in: path
    *       name: user_id
    *       schema:
    *         type: integer
    *       required: true
    *     - in: path
    *       name: password
    *       schema:
    *         type: string
    *       required: true
    *   responses:
    *     200:
    *       description: 1.) return { accessTokens }
    *       examples:
    *         application/json: { "accessToken":"60d048c6d2c99e0f98f56b4def4ed7d106a1441b3fbe7b6c1770dedcf07047126b9fd0ed9202310f523baad8be593d634d227c98cf07e633b52ddc311054ec65" }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    */
    app.route('/api/v1/aws-training-management-system/user/login/:user_id/:password')
    .post(skillController.userLogin)
};

'use strict';

// Load the 'skill' controller
const skillController = require('../controllers/skill.controller');

// Define the routes module' method
module.exports = function (app) {
   

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
    *    GetAllSkills:
    *       properties:
    *          skill_id:
    *             type: integer
    *          skill_name:
    *             type: string
    *          skill_description:
    *             type: string
    *          references:
    *             type: array
    *             items:
    *                properties:
    *                   reference_id:
    *                      type: integer
    *                   ref_link:
    *                      type: string
    *                   ref_category:
    *                      type: integer
    *                   length_in_mins:
    *                      type: integer
    *                   skill_id:
    *                      type: integer
    *    Users:
    *       properties:
    *          aws_email:
    *             type: string
    *          password:
    *             type: string
    *          last_name:
    *             type: string
    *          first_name:
    *             type: string
    *          dev:
    *             type: string
    * 
    */   

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill:
    *  post:
    *   security:
    *     - Bearer: []
    *   tags:
    *     - Skill API
    *   description: Able to add new skill.
    *     <br/><br/> For the value of ref_category, please set 0 for video category,
    *     1 for reading material and 2 for other category.
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
    */
    app.route('/api/v1/aws-training-management-system/skill')
      .post(skillController.addNewSkill)
    

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/id/{skill_id}:
    *  delete:
    *   security:
    *     - Bearer: []
    *   tags:
    *     - Skill API
    *   description: Able to delete skill details by skill ID.
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
    *         application/json: { "deleted": "1" }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    */
    app.route('/api/v1/aws-training-management-system/skill/id/:skill_id')
      .delete(skillController.deleteSkillDetailBySkillId)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/id/{skill_id}:
    *  put:
    *   security:
    *     - Bearer: []
    *   tags:
    *     - Skill API
    *   description: Able to update skill details.
    *   parameters:
    *     - in: path
    *       name: skill_id
    *       schema:
    *         type: integer
    *       required: true
    *     - in: body
    *       name: body
    *       schema:
    *         $ref: '#/definitions/Skills'
    *       required: true
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "updated": "1" }
    *     409:
    *       description: 2.) return { error_message }
    *       examples:
    *          application/json: { "error_message": "Duplicate entry."}
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/skill/id/:skill_id')
      .put(skillController.updateSkill)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/id/{skill_id}:
    *  get:
    *   security:
    *     - Bearer: []
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
    */
   app.route('/api/v1/aws-training-management-system/skill/id/:skill_id')
      .get(skillController.getSkillBySkillId)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/all:
    *  get:
    *   security:
    *     - Bearer: []
    *   tags:
    *     - Skill API
    *   description: Able to get list of skills.
    *   consumes:
    *     - application/json
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "skill_id": 2, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
    *                             "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }
    *     409:
    *       description: 2.) return { error_message }
    *       examples:
    *          application/json: {}
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/skill/all')
      .get(skillController.getAllSkills)
   
   /**
    * @swagger
    * /api/v1/aws-training-management-system/users/{user_id}/{password}:
    *  get:
    *   tags:
    *     - Login API
    *   description: Able to login user.
    *   consumes:
    *     - application/json
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
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "login": "true", "accessToken": "qaWyJhbGciOiJIUzI1NiJ9ek7e4rJRq8u431PHkuh7r5OqPpzS6l8Ll0Re-H2G0" }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    */
    app.route('/api/v1/aws-training-management-system/users/:user_id/:password')
      .get(skillController.user_login)
   
   /**
    * @swagger
    * /api/v1/aws-training-management-system/users/logout:
    *  get:
    *   security:
    *     - Bearer: []
    *   tags:
    *     - Login API
    *   description: Able to get list of skills.
    *   consumes:
    *     - application/json
    *   responses:
    *     200:
    *       description: 1.) return { result }
    *       examples:
    *         application/json: { "logout": "Successful" }
    *     503:
    *       description: 2.) return { error_message }
    *       examples:
    *         application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/users/logout')
      .get(skillController.user_logout);

   /**
    * @swagger
    * /api/v1/aws-training-management-system/users/add:
    *  post:
    *   tags:
    *     - Register API
    *   description: Able to add new user.
    *   consumes:
    *     - application/json
    *   parameters:
    *     - in: body
    *       name: body
    *       schema:
    *          $ref: '#/definitions/Users' 
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
    */
    app.route('/api/v1/aws-training-management-system/users/add')
      .post(skillController.addNewUser)

   /**
    * @swagger
    * schemes:
    *   - http
    *   - https
    * securityDefinitions:
    *   Bearer:
    *    type: apiKey
    *    name: Authorization
    *    in: header  
    */
};



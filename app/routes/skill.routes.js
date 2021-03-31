'use strict';

const { validateToken } = require('../../middleware/jwt/jwt');
// Load the 'skill' controller
const skillController = require('../controllers/skill.controller');

// Define the routes module' method
module.exports = function (app) {
  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill:
   *  post:
   *   tags:
   *     - Skill API
   *   description: Able to add new skill. <br /><br /> For the value of ref_category, please set 0 for video category, 1 for reading material category and 2 for other category.
   *
   *   parameters:
   *     - in: header
   *       name: authorization
   *       schema:
   *         type: string
   *     - in: body
   *       name: body
   *       schema:
   *         $ref: '#/definitions/Skill'
   *       required: true
   *       description: body
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "added": "1"}
   *     409:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Duplicate entry." }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   * definitions:
   *   Skill:
   *     properties:
   *       skill_name:
   *         type: string
   *       skill_description:
   *         type: string
   *       references:
   *         type: array
   *         items:
   *           $ref: '#/definitions/Reference'
   *     required:
   *       - skill_name
   *
   *   Reference:
   *     properties:
   *       ref_link:
   *         type: string
   *       ref_category:
   *         type: integer
   *       length_in_mins:
   *         type: integer
   *     required:
   *       - ref_link
   */
  app.route('/api/v1/aws-training-management-system/skill').post(validateToken, skillController.addSkill);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/{skill_id}:
   *  put:
   *   tags:
   *     - Skill API
   *   description: Able to update skill details.
   *   parameters:
   *     - in: header
   *       name: authorization
   *       schema:
   *         type: string
   *     - in: path
   *       name: skill_id
   *       schema:
   *         type: integer
   *       required: true
   *     - in: body
   *       name: body
   *       schema:
   *         $ref: '#/definitions/Skill'
   *       required: true
   *       description: body
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
   */
  app.route('/api/v1/aws-training-management-system/skill/:skill_id').put(validateToken, skillController.updateSkill);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/id/{skill_id}:
   *  get:
   *   tags:
   *     - Skill API
   *   description: Able to get skill details by skill ID.
   *   parameters:
   *     - in: header
   *       name: authorization
   *       schema:
   *         type: string
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
  app.route('/api/v1/aws-training-management-system/skill/id/:skill_id').get(validateToken, skillController.getSkillBySkillId);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/all:
   *  get:
   *   tags:
   *     - Skill API
   *   description: Able to get list of available skills.
   *   parameters:
   *     - in: header
   *       name: authorization
   *       schema:
   *         type: string
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
  app.route('/api/v1/aws-training-management-system/skill/all').get(validateToken, skillController.getSkillAll);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/{skill_id}:
   *  delete:
   *   tags:
   *     - Skill API
   *   description: Able to delete skill details by skill ID.
   *   parameters:
   *     - in: header
   *       name: authorization
   *       schema:
   *         type: string
   *     - in: path
   *       name: skill_id
   *       schema:
   *         type: integer
   *       required: true
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "deleted": "1"}
   *     503:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error." }
   */
  app.route('/api/v1/aws-training-management-system/skill/:skill_id').delete(validateToken, skillController.deleteSkillBySkillId);
};

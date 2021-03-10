'use strict';

// Load the 'skill' controller
const skillController = require('../controllers/skill.controller');

// Define the routes module' method
module.exports = function (app) {
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
    */
   app.route('/api/v1/aws-training-management-system/skill/id/:skill_id')
      .get(skillController.getSkillBySkillId)
};

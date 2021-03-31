'use strict';

// Load the 'skill' controller
const skillController = require('../controllers/skill.controller');

// Define the routes module' method
module.exports = function (app) {

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/id/{skill_id}:
    *   get:
    *     tags:
    *       - Skill API
    *     description: Able to get skill details by skill ID.
    *     parameters:
    *       - in: path
    *         name: skill_id
    *         schema:
    *           type: integer
    *         required: true
    *     responses:
    *       200:
    *         description: 1.) return { result }
    *         examples:
    *           application/json: { "skill_id": 2, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
    *                               "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }
    *       503:
    *         description: 2.) return { error_message }
    *         examples:
    *           application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/skill/id/:skill_id')
      .get(skillController.getSkillBySkillId)
      
   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/all:
    *   get:
    *     tags:
    *       - Skill API
    *     description: Able to get list of available skills.
    *     responses:
    *       200:
    *         description: 1.) return { result }
    *         examples:
    *           application/json: { "skill_id": 2, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
    *                               "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }
    *       503:
    *         description: 2.) return { error_message }
    *         examples:
    *           application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/skill/all')
      .get(skillController.getAllSkills)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill:
    *   post:
    *     tags:
    *       - Skill API
    *     description: Able to post a new skill
    *     parameters:
    *       - in: body
    *         name: body
    *         description: Skill object to be added
    *         required: true
    *         schema:
    *           $ref: '#/definitions/Skill'
    *     responses:
    *       200:
    *         description: 1.) return { result }
    *         examples:
    *           application/json: { "added": "1" }
    *       409:
    *         description: 1.) return { error_message }
    *         examples:
    *           application/json: { "error_message": "Duplicate entry." }
    *       503:
    *         description: 2.) return { error_message }
    *         examples:
    *           application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/skill')
      .post(skillController.postNewSkill)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/{skill_id}:
    *   put:
    *     tags:
    *       - Skill API
    *     description: Able to update a skill by skill id
    *     parameters:
    *       - in: path
    *         name: skill_id
    *         schema:
    *           type: integer
    *         required: true
    *       - in: body
    *         name: body
    *         description: Skill object to be added
    *         required: true
    *         schema:
    *           $ref: '#/definitions/Skill'
    *     responses:
    *       200:
    *         description: 1.) return { result }
    *         examples:
    *           application/json: { "updated": "1" }
    *       409:
    *         description: 1.) return { error_message }
    *         examples:
    *           application/json: { "error_message": "Duplicate entry." }
    *       503:
    *         description: 2.) return { error_message }
    *         examples:
    *           application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/skill/:skill_id')
      .put(skillController.putSkillBySkillId)

   /**
    * @swagger
    * /api/v1/aws-training-management-system/skill/{skill_id}:
    *   delete:
    *     tags:
    *       - Skill API
    *     description: Able to delete a skill by skill id
    *     parameters:
    *       - in: path
    *         name: skill_id
    *         schema:
    *           type: integer
    *         required: true
    *     responses:
    *       200:
    *         description: 1.) return { result }
    *         examples:
    *           application/json: { "deleted": "1" }
    *       503:
    *         description: 2.) return { error_message }
    *         examples:
    *           application/json: { "error_message": "Cannot connect to database / System error." }
    */
   app.route('/api/v1/aws-training-management-system/skill/:skill_id')
      .delete(skillController.deleteSkillBySkillId)

   /**
    * @swagger
    * definitions:
    *   Skill:
    *     type: object
    *     required:
    *       - skill_name
    *       - skill_description
    *     properties:
    *       skill_name:
    *         type: string
    *         example: NodeJS
    *       skill_description:
    *         type: string
    *         example: A backend technology...
    *       references:
    *         type: array
    *         items:
    *           $ref: '#/definitions/Reference' 
    *   Reference:
    *     type: object
    *     required:
    *       - ref_link
    *       - ref_category
    *       - length_in_mins
    *     properties:
    *       ref_link:
    *         type: string
    *         example: https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s
    *       ref_category:
    *         type: integer
    *       length_in_mins:
    *         type: integer
    *   
    */

   
};

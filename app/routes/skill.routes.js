'use strict';

// Load the 'skill' controller
const skillController = require('../controllers/skill.controller');
const passport = require('passport');
const { verifyAccessToken } = require('../../middleware/jwt/jwt');

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
     *   security:
     *     - Bearer: []
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
     * schemes:
     *   - http
     *   - https
     * securityDefinitions:
     *   Bearer:
     *     type: apiKey
     *     name: Authorization
     *     in: header
     */
    app.route('/api/v1/aws-training-management-system/skill/id/:skill_id').get(
        verifyAccessToken,
        skillController.getSkillBySkillId
    );

    /**
     * @swagger
     * /api/v1/aws-training-management-system/skill/:
     *  post:
     *   tags:
     *     - Skill API
     *   description: Able to add New Skill.
     *
     *      For the value ref_category, please set 0 for video category, 1 for reading material category and for other category
     *   parameters:
     *     - in: body
     *       name: body
     *       description: skill details
     *       required: true
     *       schema:
     *         $ref: "#/definitions/Skill"
     *   security:
     *     - Bearer: [] 
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
     *   Skill:
     *    type: object
     *    properties:
     *      skill_name:
     *        type: string
     *      skill_description:
     *        type: string
     *      references:
     *        type: array
     *        items:
     *          $ref: "#/definitions/Reference"
     *    example:
     *      skill_name: "NodeJS"
     *      skill_description: "A backend technology ..."
     *      references: [{ref_link: "https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2s" , ref_category: 0, length_in_mins: 60}]
     *
     *   Reference:
     *     type: object
     *     properties:
     *       ref_link:
     *         type: string
     *       ref_category:
     *         type: integer
     *       length_in_mins:
     *         type: integer
     *       skill_id:
     *         type: integer
     *     example:
     *       ref_link: "https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2s"
     *       ref_category: 0
     *       length_in_mins: 60
     *       skill_id: 1
     *
     */
    app.route('/api/v1/aws-training-management-system/skill/').post(
        verifyAccessToken,
        skillController.addNewSkill
    );

    /**
     * @swagger
     * /api/v1/aws-training-management-system/skill/{skill_id}:
     *  put:
     *   tags:
     *     - Skill API
     *   description: Able to Update Skill details.
     *   parameters:
     *     - in: path
     *       name: skill_id
     *       schema:
     *         type: integer
     *       required: true
     *     - in: body
     *       name: body
     *       description: skill details
     *       required: true
     *       schema:
     *         $ref: "#/definitions/Skill"
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
     *
     */
    app.route('/api/v1/aws-training-management-system/skill/:skill_id').put(
        verifyAccessToken,
        skillController.updateSkillDetails
    );

    /**
     * @swagger
     * /api/v1/aws-training-management-system/skill/{skill_id}:
     *  delete:
     *   tags:
     *     - Skill API
     *   description: Able to Delete Skill details by skill id.
     *   parameters:
     *     - in: path
     *       name: skill_id
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
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     *
     */
    app.route('/api/v1/aws-training-management-system/skill/:skill_id').delete(verifyAccessToken,
        skillController.deleteSkillBySkillId
    );

    /**
     * @swagger
     * /api/v1/aws-training-management-system/skill/all:
     *  get:
     *   tags:
     *     - Skill API
     *   description: Get all available skills
     *   security:
     *     - Bearer: []
     *   responses:
     *     200:
     *       description: 1.) return { result }
     *       examples:
     *         application/json: [
     *             {
     *               "skill__id": 2,
     *               "skill_name": "NodeJS",
     *               "skill_description": "A backend technology ...",
     *               "references:": [
     *                  {
     *                    reference_id: 10,
     *                    ref_link: "string",
     *                    ref_category: "string",
     *                    skill_id: 2,
     *                  }
     *                ]
     *             }
     *          ]
     *     503:
     *       description: 2.) return { error_message }
     *       examples:
     *         application/json: { "error_message": "Cannot connect to database / System error." }
     *
     */
    app.route('/api/v1/aws-training-management-system/skill/all').get(verifyAccessToken, skillController.getAllSkills);
};

const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../server");
chai.should();
chai.use(chaiHttp);

const sinon = require("sinon");

const skillModel = require('../app/models/skill.model');
const { assert } = require("@hapi/joi");

describe('Skill API', function () {
    describe('getSkillBySkillId', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);
            sinon
                .stub(skillModel, 'getSkillBySkillId')
                .resolves([{"skill_id":3,"skill_name":"MySQL","skill_description":"A RDBMS..."}]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to acquire skills based on skill ID.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/2')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "skill_id": 3,
                        "skill_name": "MySQL",
                        "skill_description": "A RDBMS...",
                        "references": [
                          {
                            "reference_id": 3,
                            "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                            "ref_category": 0,
                            "length_in_mins": 12,
                            "skill_id": 3
                          }
                        ]
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });
    
    describe('getSkillBySkillId no data found case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getSkillBySkillId')
                .resolves({length:0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No data found when tried to acquire skill details based on skill ID.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/99')
                .end((err, response) => {
                    const checkObj = JSON.stringify({});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('getSkillBySkillId no data found using invalid id case', () => {
        beforeEach(() => {
            sinon
            .stub(skillModel, 'getSkillBySkillId')
            .resolves({params:"abc"});
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves({params:"abc"});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No data found when tried to acquire invalid skill ID.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/"abc"')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"Invalid request."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    describe('getSkillBySkillId no data found due to no connection case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getSkillBySkillId')
                .rejects({code: "ERR_SYSTEM_ERROR"});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No data found when tried to acquire skill by skill_id due to no connection .', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/2')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "error_message":"Cannot connect to database / System error."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                })
        });
    });

    // Get all skill unit test
    describe('getAllAvailableSkills', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getAllAvailableSkills')
                .resolves([{"skill_id":3,"skill_name":"MySQL","skill_description":"A RDBMS..."}]);
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);

        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to acquire all available skills.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/allSkill')
                .end((err, response) => {
                    const checkObj = JSON.stringify([{
                        "skill_id": 3,
                        "skill_name": "MySQL",
                        "skill_description": "A RDBMS...",
                        "references": [
                          {
                            "reference_id": 3,
                            "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                            "ref_category": 0,
                            "length_in_mins": 12,
                            "skill_id": 3
                          }
                        ]
                    }]);
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    // No data found
    describe('getAllAvailableSkills no data found case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getAllAvailableSkills')
                .resolves({length:0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No data found when tried to acquire all available skills.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/allSkill')
                .end((err, response) => {
                    const checkObj = JSON.stringify({});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });
    
    describe('getAllAvailableSkills no data found due to no connection case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getAllAvailableSkills')
                .rejects({code: "ERR_SYSTEM_ERROR"});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No data found when tried to acquire all available skills due to no connection .', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/allSkill')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "error_message":"Cannot connect to database / System error."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                })
        });
    });

    // Add new skill unit test
    describe('addNewSkills', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkills')
                .resolves({"affectedRows":1, "insertId":3});
            sinon
                .stub(skillModel, 'addSkillReference')
                .resolves({"affectedRows":1, "insertId":3});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to add new skills.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill/addNewSkills')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id":3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        added: 1
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('addNewSkill failure due to string input case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkills')
                .resolves({affectedRows:1, "insertId":3});
            sinon
                .stub(skillModel, 'addSkillReference')
                .resolves({"insertId":3});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to add new skills due to invalid input of strings.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill/addNewSkills')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": "fail",
                        "length_in_mins": "fail",
                        "skill_id": "fail"
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: "Invalid request."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    describe('addNewSkills failure due to number input case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkills')
                .resolves({affectedRows:0, "insertId":3});
            sinon
                .stub(skillModel, 'addSkillReference')
                .resolves({"insertId":3});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to add new skills due to invalid input of numbers.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill/addNewSkills')
                .send({
                    "skill_id": 3,
                    "skill_name": 1,
                    "skill_description": 1,
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: "Invalid request."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    describe('addNewSkills failure due to affected row is 0', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkills')
                .resolves({affectedRows:0, "insertId":3});
            sinon
                .stub(skillModel, 'addSkillReference')
                .resolves({"insertId":3});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to add new skills due to affected row is 0.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill/addNewSkills')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id":3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "added": 0
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });
	
	describe('addNewSkills duplicate input case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkills')
                .rejects({code: "ER_DUP_ENTRY"});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to add new skill due to duplicate input.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill/addNewSkills')
                .send({
                    "skill_name": "test3",
                    "skill_description": "test3",
                    "references": [
                        {
                        "ref_link": "test3",
                        "ref_category": 3,
                        "length_in_mins": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "error_message":"Duplicate entry."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(409);
                    done();
                })
        });
    });

    describe('addNewSkills system error due to no connection case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkills')
                .rejects({code: "ERR_SYSTEM_ERROR"});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('System error to add new skill due to no connection case', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill/addNewSkills')
                .send({
                    "skill_name": "test3",
                    "skill_description": "test3",
                    "references": [
                        {
                        "ref_link": "test3",
                        "ref_category": 3,
                        "length_in_mins": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "error_message":"Cannot connect to database / System error."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                })
        });
    });

    // Update skill
    describe('updateSkills', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkills')
                .resolves({affectedRows:1});
            sinon
                .stub(skillModel, 'updateSkillReference')
                .resolves({affectedRows:1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to update skill.', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/updateSkills/3/3')
                .send({
                    "skill_id":3,
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        updated: 1
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });
    
    describe('updateSkills failure due to string input case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkills')
                .resolves({affectedRows:0});
            sinon
                .stub(skillModel, 'updateSkillReference')
                .resolves({affectedRows:0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to update skill due to invalid input of strings.', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/updateSkills/"test"/3')
                .send({
                    "skill_id": "test",
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": "test"
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: "Invalid request."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    describe('updateSkills failure due to affected row is 0', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkills')
                .resolves({affectedRows:0});
            sinon
                .stub(skillModel, 'updateSkillReference')
                .resolves({affectedRows:0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to update skills due to affected row is 0.', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/updateSkills/3/3')
                .send({
                    "skill_id":3,
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        updated: 0
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });
	
    describe('updateSkills duplicate input case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkills')
                .rejects({code: "ER_DUP_ENTRY"});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to update skill due to duplicate input.', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/updateSkills/3/3')
                .send({
                    "skill_id":3,
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "error_message":"Duplicate entry."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(409);
                    done();
                })
        });
    });

    describe('updateSkills system error due to no connection case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkills')
                .rejects({code: "ERR_SYSTEM_ERROR"});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('System error to update skill due to no connection case.', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/updateSkills/3/3')
                .send({
                    "skill_id":3,
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "error_message":"Cannot connect to database / System error."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                })
        });
    });

    // Delete skill
    describe('deleteSkills', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillReference')
                .resolves({affectedRows:1});
            sinon
                .stub(skillModel, 'deleteSkills')
                .resolves({affectedRows:1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to delete skills.', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/deleteSkills/id/3')
                .send({
                    "skill_id": 3,
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        deleted: "1"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    // Failure to delete skill
    describe('deleteSkills fail due to invalid input', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillReference')
                .resolves({affectedRows:0});
            sinon
                .stub(skillModel, 'deleteSkills')
                .resolves({affectedRows:0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to delete skill due to invalid input', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/deleteSkills/id/"test"')
                .send({
                    "skill_id": "abc",
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": "abc"
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: "Invalid request."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    describe('deleteSkills failure due to affected row is 0', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillReference')
                .resolves({affectedRows:0});
            sinon
                .stub(skillModel, 'deleteSkills')
                .resolves({affectedRows:0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Failure to delete skills due to affected row is 0.', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/deleteSkills/id/3')
                .send({
                    "skill_id": 3,
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                        {
                        "reference_id": 3,
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                        "skill_id": 3
                        }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        deleted: "0"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });
});

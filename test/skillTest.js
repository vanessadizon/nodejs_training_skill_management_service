const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../server");
chai.should();
chai.use(chaiHttp);

const sinon = require("sinon");

const skillModel = require('../app/models/skill.model');

describe('Skill API', function () {
    
    //GET Skill by skill id
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
                .get('/api/v1/aws-training-management-system/skill/id/3')
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
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No data found when tried to acquire skill details based on skill ID.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/10')
                .end((err, response) => {
                    const checkObj = JSON.stringify({});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('getSkillBySkillId wrong input', () => {

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Wrong skill id input.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/a')
                .end((err, response) => {
                    const checkObj = JSON.stringify({"error_message":"Unprocessable Entity."});
                    const errorMessage = JSON.stringify(response.body);
                    errorMessage.should.be.eql(checkObj);
                    done();
                })
        });
    });

    //GET all skills
    describe('getAllSkills', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getAllSkills')
                .resolves([{"skill_id":3,"skill_name":"MySQL","skill_description":"A RDBMS..."}]);
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Gets all skills.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/all')
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

    describe('getAllSkills no data found.', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getAllSkills')
                .resolves([]);
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([]);
            sinon
                .stub(skillModel, 'getSkillBySkillId')
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Gets no skills.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/all')
                .end((err, response) => {
                    const checkObj = JSON.stringify({});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('getAllSkills server error', () => {

        beforeEach(() => {
            const err = new Error();
            err.code = "ERR_SYSTEM_ERROR";
            sinon
                .stub(skillModel, 'getAllSkills')
                .throws(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Server error.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/all')
                .end((err, response) => {
                    const checkObj = JSON.stringify({"error_message":"Cannot connect to database / System error."});
                    const errorMessage = JSON.stringify(response.body);
                    errorMessage.should.be.eql(checkObj);
                    done();
                })
        });
    });

    //POST new skill
    describe('postNewSkill', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'postNewSkill')
                .resolves([]);
            sinon
                .stub(skillModel, 'postNewReference')
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Post new skill.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "NodeJS",
                    "skill_description": "A backend technology...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s",
                        "ref_category": 0,
                        "length_in_mins": 0
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({ "added": "1"});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('postNewSkill validation error', () => {

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Post new skill.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_description": "A backend technology...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s",
                        "ref_category": 0,
                        "length_in_mins": 0
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify("Unprocessable Entity.");
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    describe('postNewSkill duplicate entry', () => {
        beforeEach(() => {
            const err = new Error();
            err.code = "ER_DUP_ENTRY";
            sinon
                .stub(skillModel, 'postNewSkill')
                .throws(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Post new skill.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "NodeJS",
                    "skill_description": "A backend technology...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s",
                        "ref_category": 0,
                        "length_in_mins": 0
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify("Duplicate entry.");
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(409);
                    done();
                })
        });
    });

    describe('postNewSkill duplicate entry', () => {
        beforeEach(() => {
            const err = new Error();
            err.code = "ER_NEW_ERROR";
            sinon
                .stub(skillModel, 'postNewSkill')
                .throws(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Post new skill.', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "NodeJS",
                    "skill_description": "A backend technology...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s",
                        "ref_category": 0,
                        "length_in_mins": 0
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify("Internal Server Error.");
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(500);
                    done();
                })
        });
    });

    //PUT skill by skill id
    describe('putSkillBySkillId', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'putSkillBySkillId')
                .resolves([]);
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);
            sinon
                .stub(skillModel, 'putReferenceByReferenceId')
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Put skill by skill id.', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/3')
                .send({
                    "skill_name": "NodeJS",
                    "skill_description": "A backend technology...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s",
                        "ref_category": 0,
                        "length_in_mins": 0
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({ "updated": "1"});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('putSkillBySkillId validation error', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Put skill by skill id.', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/3')
                .send({
                    "skill_description": "A backend technology...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s",
                        "ref_category": 0,
                        "length_in_mins": 0
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify("Unprocessable Entity.");
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    //DELETE skill by skill id
    describe('deleteSkillBySkillId', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillBySkillId')
                .resolves([{}]);
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);
            sinon
                .stub(skillModel, 'deleteReferenceByReferenceId')
                .resolves([{}]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Delete skill by skill id.', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/1')
                .end((err, response) => {
                    const checkObj = JSON.stringify({ "deleted": "1"});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('deleteSkillBySkillId validation error', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Delete skill by skill id.', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/a')
                .end((err, response) => {
                    const checkObj = JSON.stringify("Unprocessable Entity.");
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });
});
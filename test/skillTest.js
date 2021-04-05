const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../server");
chai.should();
chai.use(chaiHttp);

const sinon = require("sinon");

const skillModel = require('../app/models/skill.model');

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
                .get('/api/v1/aws-training-management-system/skill/id/20')
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
                    const checkObj = JSON.stringify({
                        error_message: 'Skill_id does not exist'});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('getSkillBySkillId wrong parameter input case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getSkillBySkillId' )
                .resolves([])
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Wrong input parameter', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/asd')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: "\"skill_id\" must be a number"});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });

    });

    describe('deleteSkillDetailBySkillId wrong parameter input case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillDetailBySkillId' )
                .resolves([])
            sinon
                .stub(skillModel, 'deleteReferenceBySkillId' )
                .resolves([])
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('(Delete)wrong input parameter', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/id/asd')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: "\"skill_id\" must be a number"});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe('Successful delete case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillDetailBySkillId' )
                .resolves({affectedRows : 1});
            sinon
                .stub(skillModel, 'deleteReferenceBySkillId' )
                .resolves({affectedRows : 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to delete', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/id/20')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        deleted:"1"});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('Unsuccesfful delete case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getSkillBySkillId')
                .resolves({affectedRows : 0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No record deleted', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/id/20')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
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
    
    describe('addNewSkill succesfful add case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkill')
                .resolves({affectedRows : 1});
            sinon
                .stub(skillModel, 'addReferences')
                .resolves({affectedRows : 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Record added', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        added: "1"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('addNewSkill unsuccesfful add case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkill')
                .resolves({affectedRows : 0});
            sinon
                .stub(skillModel, 'addReferences')
                .resolves({affectedRows : 0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No record added', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        added: "0"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('addNewSkill no skill_name case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkill')
                .resolves({affectedRows : 1});
            sinon
                .stub(skillModel, 'addReferences')
                .resolves({affectedRows : 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('skill_name required case', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"\"skill_name\" is required"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe('addNewSkill no ref_link case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkill')
                .resolves([]);
            sinon
                .stub(skillModel, 'addReferences')
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('ref_link required case', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"\"references[0].ref_link\" is required"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe('addNewSkill ref_category must in between 0-2 case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkill')
                .resolves([]);
            sinon
                .stub(skillModel, 'addReferences')
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Wrong ref_category input case', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 5,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"\"references[0].ref_category\" must be one of [0, 1, 2]"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe('addNewSkill duplicate case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkill')
                .rejects({code: "ER_DUP_ENTRY"})
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Duplicate skill_name', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    "skill_name": "Javascript",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"Duplicate Entry."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(409);
                    done();
                })
        });
    });

    describe('updateSkill succesfful update case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkillDetail')
                .resolves({affectedRows : 1});
            sinon
                .stub(skillModel, 'updateReferences')
                .resolves({affectedRows : 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to update record', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/id/20')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        updated: "1"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('updateSkill unsuccesfful update case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getSkillBySkillId')
                .resolves({affectedRows : 0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No record updated', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/id/20')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: 'Skill_id does not exist'
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('updateSkill no skill_name case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkillDetail')
                .resolves({affectedRows : 1});
            sinon
                .stub(skillModel, 'updateReferences')
                .resolves({affectedRows : 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('skill_name required case', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/id/20')
                .send({
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"\"skill_name\" is required"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe('updateSkill no ref_link case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkillDetail')
                .resolves({affectedRows : 1});
            sinon
                .stub(skillModel, 'updateReferences')
                .resolves({affectedRows : 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('ref_link required case', (done) => {
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/20')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"\"references[0].ref_link\" is required"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe('updateSkill ref_category must in between 0-2 case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkillDetail')
                .resolves({affectedRows : 1});
            sinon
                .stub(skillModel, 'updateReferences')
                .resolves({affectedRows : 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Wrong ref_category input case', (done) => {
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/20')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 5,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"\"references[0].ref_category\" must be one of [0, 1, 2]"
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe('updateSkill duplicate case', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkillDetail')
                .rejects({code: "ER_DUP_ENTRY"})
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Duplicate skill_name', (done) => {
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/20')
                .send({
                    "skill_name": "Javascript",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:"Duplicate Entry."
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(409);
                    done();
                })
        });
    });

    describe('getAllSkills case', () => {
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

        it('Able to acquire all skills based on the database.', (done) => {
            chai.request(app)
            .get('/api/v1/aws-training-management-system/skill/all')
                .send({
                    "skill_name": "MySQL",
                    "skill_description": "A RDBMS...",
                    "references": [
                      {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12,
                      }
                    ]
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify(
                        [
                            {"skill_id":3,"skill_name":"MySQL","skill_description":"A RDBMS...",
                            "references":[
                                {
                                    "reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3
                                }
                            ]
                        }
                    ]);
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

    describe('getAllSkills no skill in db', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getAllSkills')
                .resolves([]);
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No record retrieve.', (done) => {
            chai.request(app)
            .get('/api/v1/aws-training-management-system/skill/all')
                .send({})
                .end((err, response) => {
                    const checkObj = JSON.stringify({});
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                })
        });
    });

});

const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../server");
chai.should();
chai.use(chaiHttp);

const sinon = require("sinon");

const skillModel = require('../app/models/skill.model');

describe('Skill API', function () {

    describe('getSkillAll with multiple skills', () => {
        it('Able to acquire all skills from database with multiple skills.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/all')
                .end((err, response) => {
                    const checkObj = JSON.stringify([{
                        "skill_id": 24,
                        "skill_name": "NodeJS",
                        "skill_description": "NodeJS Programming",
                        "references": [
                          {
                            "reference_id": 18,
                            "ref_link": "https://www.w3schools.com/nodejs/",
                            "ref_category": 0,
                            "length_in_mins": 20,
                            "skill_id": 24
                          }
                        ]
                    },
                    {
                        "skill_id": 25,
                        "skill_name": "MySQL",
                        "skill_description": "A RDBMS...",
                        "references": [
                          {
                            "reference_id": 19,
                            "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                            "ref_category": 0,
                            "length_in_mins": 12,
                            "skill_id": 25
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

    describe('getSkillAll with one skill', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getReferenceBySkillId')
                .resolves([{"reference_id":3,"ref_link":"https://www.youtube.com/watch?v=2bW3HuaAUcY","ref_category":0,"length_in_mins":12,"skill_id":3}]);
            sinon
                .stub(skillModel, 'getSkillAll')
                .resolves([{"skill_id":3,"skill_name":"MySQL","skill_description":"A RDBMS..."}]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Able to acquire all skills from database with one skill.', (done) => {
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

    describe('getSkillAll with no skill', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'getSkillAll')
                .resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Able to acquire all skills from database with no skill.', (done) => {
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

    describe('getSkillBySkillId with invalid input', () => {
        it('Error on getSkillBySkillId due to invalid skill ID input.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/s')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "err":{
                            "_original":{
                                "skill_id":"s"
                            },"details":[{
                                "message":"\"skill_id\" must be a number",
                                "path":[
                                    "skill_id"
                                ],"type":"number.base",
                                "context":{
                                    "label":"skill_id",
                                    "value":"s",
                                    "key":"skill_id"
                                }
                            }]
                        }
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
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

    describe('postSkill', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'postSkill')
                .resolves({affectedRows: 1});
            sinon
                .stub(skillModel, 'postReference')
                .resolves({affectedRows: 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('postSkill with given details', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "added":"1"
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });

    describe('postSkill with invalid URI input', () => {
        it('Error on postSkill due to invalid URI input.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"references[0].ref_link\" must be a valid uri",
                        "path":[
                            "references",
                            0,
                            "ref_link"
                        ],"type":"string.uri",
                        "context":{
                            "label":"references[0].ref_link",
                            "value":"dQw4w9WgXcQ",
                            "key":"ref_link"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with invalid skill name input', () => {
        it('Error on postSkill due to invalid skill name input.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": 1,
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":1,
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"skill_name\" must be a string",
                        "path":[
                            "skill_name"
                        ],"type":"string.base",
                        "context":{
                            "label":"skill_name",
                            "value":1,
                            "key":"skill_name"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with invalid skill description input', () => {
        it('Error on postSkill due to invalid skill description input.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": 1,
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":1,
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"skill_description\" must be a string",
                        "path":[
                            "skill_description"
                        ],"type":"string.base",
                        "context":{
                            "label":"skill_description",
                            "value":1,
                            "key":"skill_description"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with invalid ref link type input', () => {
        it('Error on postSkill due to invalid ref link type input.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": 1,
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":1,
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"references[0].ref_link\" must be a string",
                        "path":[
                            "references",
                            0,
                            "ref_link"
                        ],"type":"string.base",
                        "context":{
                            "label":"references[0].ref_link",
                            "value":1,
                            "key":"ref_link"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with invalid ref category input', () => {
        it('Error on postSkill due to invalid ref category input.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": "s",
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":"s",
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"references[0].ref_category\" must be a number",
                        "path":[
                            "references",
                            0,
                            "ref_category"
                        ],"type":"number.base",
                        "context":{
                            "label":"references[0].ref_category",
                            "value":"s",
                            "key":"ref_category"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with invalid length in mins input', () => {
        it('Error on postSkill due to invalid length in mins input.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": "s"
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":"s"
                        }]
                    },"details":[{
                        "message":"\"references[0].length_in_mins\" must be a number",
                        "path":[
                            "references",
                            0,
                            "length_in_mins"
                        ],"type":"number.base",
                        "context":{
                            "label":"references[0].length_in_mins",
                            "value":"s",
                            "key":"length_in_mins"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with duplicate entry', () => {
        it('Error on postSkill due to duplicate detail entries.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "MySQL",
                "skill_description": "A RDBMS...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "error message":"Duplicate entry."
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(409);
            done();
            })
        });
    });

    describe('postSkill with missing required attributes', () => {
        it('Error on postSkill due to missing required attributes (skill name)', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{
                        "_original":{
                            "skill_description":"A scripting language...",
                            "references":[{
                                "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                                "ref_category":0,"length_in_mins":30
                            }]
                        },"details":[{
                            "message":"\"skill_name\" is required",
                            "path":["skill_name"],
                            "type":"any.required",
                            "context":{
                                "label":"skill_name",
                                "key":"skill_name"
                            }
                        }]
                    }
                });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with missing non-required attributes', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'postSkill')
                .resolves({affectedRows: 1});
            sinon
                .stub(skillModel, 'postReference')
                .resolves({affectedRows: 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('postSkill with missing non-required attributes (skill description)', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "added":"1"
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });

    describe('postSkill with extra attributes', () => {
        it('Error on postSkill due to extra attributes (skill origin)', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "skill_origin":"Cebu",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "skill_origin":"Cebu",
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"skill_origin\" is not allowed",
                        "path":[
                            "skill_origin",
                        ],"type":"object.unknown",
                        "context":{
                            "child":"skill_origin",
                            "label":"skill_origin",
                            "value":"Cebu",
                            "key":"skill_origin"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('postSkill with 0 affected rows', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'postSkill')
                .resolves({affectedRows: 0});
            sinon
                .stub(skillModel, 'postReference')
                .resolves({affectedRows: 0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Returns empty because of 0 affected rows on postSkill.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({                    
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });

    describe('postSkill with system error', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'postSkill')
                .throws();
            sinon
                .stub(skillModel, 'postReference')
                .throws();
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Returns error message because of system error on postSkill.', (done) =>{
            chai.request(app)
            .post('/api/v1/aws-training-management-system/skill')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({    
                    "error message":"Cannot connect to database / System error."                
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(503);
            done();
            })
        });
    });

    describe('putSkillBySkillId', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'putSkillBySkillId')
                .resolves({affectedRows: 1});
            sinon
                .stub(skillModel, 'putReferenceBySkillId')
                .resolves({affectedRows: 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('putSkill with given details and skill ID', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "updated":"1"
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });

    describe('putSkillBySkillId with invalid URI input', () => {
        it('Error on putSkillBySkillId due to invalid URI input.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"references[0].ref_link\" must be a valid uri",
                        "path":[
                            "references",
                            0,
                            "ref_link"
                        ],"type":"string.uri",
                        "context":{
                            "label":"references[0].ref_link",
                            "value":"dQw4w9WgXcQ",
                            "key":"ref_link"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('putSkillBySkillId with invalid skill name input', () => {
        it('Error on putSkillBySkillId due to invalid skill name input.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": 1,
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":1,
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"skill_name\" must be a string",
                        "path":[
                            "skill_name"
                        ],"type":"string.base",
                        "context":{
                            "label":"skill_name",
                            "value":1,
                            "key":"skill_name"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('putSkillBySkillId with invalid skill description input', () => {
        it('Error on putSkillBySkillId due to invalid skill description input.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": "HTML",
                "skill_description": 1,
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":1,
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"skill_description\" must be a string",
                        "path":[
                            "skill_description"
                        ],"type":"string.base",
                        "context":{
                            "label":"skill_description",
                            "value":1,
                            "key":"skill_description"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('putSkillBySkillId with invalid ref link type input', () => {
        it('Error on putSkillBySkillId due to invalid ref link type input.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": 1,
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":1,
                            "ref_category":0,
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"references[0].ref_link\" must be a string",
                        "path":[
                            "references",
                            0,
                            "ref_link"
                        ],"type":"string.base",
                        "context":{
                            "label":"references[0].ref_link",
                            "value":1,
                            "key":"ref_link"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('putSkillBySkillId with invalid ref category input', () => {
        it('Error on putSkillBySkillId due to invalid ref category input.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": "s",
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":"s",
                            "length_in_mins":30
                        }]
                    },"details":[{
                        "message":"\"references[0].ref_category\" must be a number",
                        "path":[
                            "references",
                            0,
                            "ref_category"
                        ],"type":"number.base",
                        "context":{
                            "label":"references[0].ref_category",
                            "value":"s",
                            "key":"ref_category"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('putSkillBySkillId with invalid length in mins input', () => {
        it('Error on putSkill due to invalid length in mins input.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": "s"
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "err":{"_original":{
                        "skill_name":"HTML",
                        "skill_description":"A scripting language...",
                        "references":[{
                            "ref_link":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "ref_category":0,
                            "length_in_mins":"s"
                        }]
                    },"details":[{
                        "message":"\"references[0].length_in_mins\" must be a number",
                        "path":[
                            "references",
                            0,
                            "length_in_mins"
                        ],"type":"number.base",
                        "context":{
                            "label":"references[0].length_in_mins",
                            "value":"s",
                            "key":"length_in_mins"
                        }
                    }]
                }
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(422);
            done();
            })
        });
    });

    describe('putSkillBySkillId with same entry', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'putSkillBySkillId')
                .resolves({affectedRows: 1});
            sinon
                .stub(skillModel, 'putReferenceBySkillId')
                .resolves({affectedRows: 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('putSkillBySkillId with given skill ID but same details', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/25')
            .send({
                "skill_name": "MySQL",
                "skill_description": "A RDBMS...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=2bW3HuaAUcY",
                        "ref_category": 0,
                        "length_in_mins": 12
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "updated":"1"
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });

    describe('putSkillBySkillId with 0 affected rows', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'putSkillBySkillId')
                .resolves({affectedRows: 0});
            sinon
                .stub(skillModel, 'putReferenceBySkillId')
                .resolves({affectedRows: 0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Returns empty because of 0 affected rows on putSkillBySkillId.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/1')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({                    
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });

    describe('putSkillBySkillId with system error', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'putSkillBySkillId')
                .throws();
            sinon
                .stub(skillModel, 'putReferenceBySkillId')
                .throws();
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Returns error message because of system error on putSkillBySkillId.', (done) =>{
            chai.request(app)
            .put('/api/v1/aws-training-management-system/skill/id/1')
            .send({
                "skill_name": "HTML",
                "skill_description": "A scripting language...",
                "references": [
                    {
                        "ref_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "ref_category": 0,
                        "length_in_mins": 30
                    }
                ]
            })
            .end((err, response) => {
                const checkObj = JSON.stringify({    
                    "error message":"Cannot connect to database / System error."                
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(503);
            done();
            })
        });
    });
    
    describe('deleteSkillBySkillId', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillBySkillId')
                .resolves({affectedRows: 1});
            sinon
                .stub(skillModel, 'deleteReferenceBySkillId')
                .resolves({affectedRows: 1});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to delete skills based on skill ID.', (done) =>{
            chai.request(app)
            .delete('/api/v1/aws-training-management-system/skill/id/25')
            .end((err, response) => {
                const checkObj = JSON.stringify({
                    "deleted":"1"
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });
    
    describe('deleteSkillBySkillId with invalid input', () => {
        it('Error on deleteSkillBySkillId due to invalid skill ID input.', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/id/s')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        "err":{
                            "_original":{
                                "skill_id":"s"
                            },"details":[{
                                "message":"\"skill_id\" must be a number",
                                "path":[
                                    "skill_id"
                                ],"type":"number.base",
                                "context":{
                                    "label":"skill_id",
                                    "value":"s",
                                    "key":"skill_id"
                                }
                            }]
                        }
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(422);
                    done();
                })
        });
    });

    describe('deleteSkillBySkillId with 0 affected rows', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillBySkillId')
                .resolves({affectedRows: 0});
            sinon
                .stub(skillModel, 'deleteReferenceBySkillId')
                .resolves({affectedRows: 0});
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Returns empty because of 0 affected rows on deleteSkillBySkillId.', (done) =>{
            chai.request(app)
            .delete('/api/v1/aws-training-management-system/skill/id/1')
            .end((err, response) => {
                const checkObj = JSON.stringify({                    
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(200);
            done();
            })
        });
    });

    describe('deleteSkillBySkillId with system error', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillBySkillId')
                .throws();
            sinon
                .stub(skillModel, 'deleteReferenceBySkillId')
                .throws();
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });
        it('Returns error message because of system error on deleteSkillBySkillId.', (done) =>{
            chai.request(app)
            .delete('/api/v1/aws-training-management-system/skill/id/1')
            .end((err, response) => {
                const checkObj = JSON.stringify({    
                    "error message":"Cannot connect to database / System error."                
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(checkObj);
            response.should.have.status(503);
            done();
            })
        });
    });
});

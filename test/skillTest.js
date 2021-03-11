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
});

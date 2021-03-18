const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../server');
chai.should();
chai.use(chaiHttp);

const sinon = require('sinon');

const skillModel = require('../app/models/skill.model');

describe('Skill API', function () {
    describe('getSkillBySkillId', () => {
        beforeEach(() => {
            sinon.stub(skillModel, 'getReferenceBySkillId').resolves([
                {
                    reference_id: 3,
                    ref_link: 'https://www.youtube.com/watch?v=2bW3HuaAUcY',
                    ref_category: 0,
                    length_in_mins: 12,
                    skill_id: 3,
                },
            ]);
            sinon.stub(skillModel, 'getSkillBySkillId').resolves([
                {
                    skill_id: 3,
                    skill_name: 'MySQL',
                    skill_description: 'A RDBMS...',
                },
            ]);
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
                        skill_id: 3,
                        skill_name: 'MySQL',
                        skill_description: 'A RDBMS...',
                        references: [
                            {
                                reference_id: 3,
                                ref_link:
                                    'https://www.youtube.com/watch?v=2bW3HuaAUcY',
                                ref_category: 0,
                                length_in_mins: 12,
                                skill_id: 3,
                            },
                        ],
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                });
        });
    });

    describe('getSkillBySkillId no data found case', () => {
        beforeEach(() => {
            sinon.stub(skillModel, 'getSkillBySkillId').resolves([]);
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
                });
        });
    });

    describe('getSkillBySkillId invalid skill_id format', () => {
        afterEach((done) => {
            done();
        });

        it('return validation error_message', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/abcd')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: 'skill_id must be an integer',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('getSkillBySkillId cant connect to database', () => {
        beforeEach(() => {
            var err = new Error('ER_BAD_DB_ERROR');
            err.errorno = '1049';
            err.code = 'ER_BAD_DB_ERROR';
            sinon.stub(skillModel, 'getSkillBySkillId').rejects(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return database error_message', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/id/10')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:
                            'Cannot connect to database / System error.',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                });
        });
    });

    describe('add new skill', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'addNewSkill')
                .resolves({ affectedRows: 1, insertId: 1 });
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to add new Skill', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    skill_name: 'NodeJs ',
                    skill_description: 'A backend technology ...',
                    references: [
                        {
                            ref_link:
                                'https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2s',
                            ref_category: 0,
                            length_in_mins: 60,
                        },
                    ],
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        added: '1',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                });
        });
    });

    describe('addNewSkill without request body', () => {
        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return validation error', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:
                            'ValidationError: "skill_name" is required',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('addNewSkill cant connect to database', () => {
        beforeEach(() => {
            var err = new Error('ER_BAD_DB_ERROR');
            err.errorno = '1049';
            err.code = 'ER_BAD_DB_ERROR';
            sinon.stub(skillModel, 'addNewSkill').rejects(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return database error message', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    skill_name: 'NodeJs ',
                    skill_description: 'A backend technology ...',
                    references: [
                        {
                            ref_link:
                                'https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2s',
                            ref_category: 0,
                            length_in_mins: 60,
                        },
                    ],
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:
                            'Cannot connect to database / System error.',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                });
        });
    });

    describe('addNewSkill duplicate entry', () => {
        beforeEach(() => {
            var err = new Error('ER_DUP_ENTRY');
            err.errorno = '1062';
            err.code = 'ER_DUP_ENTRY';
            sinon.stub(skillModel, 'addNewSkill').rejects(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return database error message - duplicate entry', (done) => {
            chai.request(app)
                .post('/api/v1/aws-training-management-system/skill')
                .send({
                    skill_name: 'NodeJs ',
                    skill_description: 'A backend technology ...',
                    references: [
                        {
                            ref_link:
                                'https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2s',
                            ref_category: 0,
                            length_in_mins: 60,
                        },
                    ],
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: 'Duplicate entry.',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(409);
                    done();
                });
        });
    });

    describe('updateSkillDetails', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'updateSkillDetails')
                .resolves({ affectedRows: 1 });
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to update skill details by Skill Id', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/1')
                .send({
                    skill_name: 'MySQL ',
                    skill_description: 'RDBMS ...',
                    references: [
                        {
                            ref_link:
                                'https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2s',
                            ref_category: 0,
                            length_in_mins: 60,
                        },
                    ],
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        updated: '1',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                });
        });
    });

    describe('updateSkillDetails invalid skill_id', () => {
        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return validation error_message', (done) => {
            chai.request(app)
                .put(
                    '/api/v1/aws-training-management-system/skill/fsadfdadsads'
                )
                .send({
                    skill_name: 'MySQL ',
                    skill_description: 'RDBMS ...',
                    references: [
                        {
                            ref_link:
                                'https://www.youtube.com/watch?v=fBNz5xF-Kx4&t=2s',
                            ref_category: 0,
                            length_in_mins: 60,
                        },
                    ],
                })
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: 'skill_id must be an integer',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('updateSkillDetails without request body', () => {
        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return validation error_message', (done) => {
            chai.request(app)
                .put('/api/v1/aws-training-management-system/skill/1')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:
                            'ValidationError: "skill_name" is required',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('deleteSkillBySkillId', () => {
        beforeEach(() => {
            sinon
                .stub(skillModel, 'deleteSkillBySkillId')
                .resolves({ affectedRows: 1 });
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to delete skill details by id', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/1')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        deleted: '1',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                });
        });
    });

    describe('deleteSkillBySkillId invalid skill_id format', () => {
        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to delete skill details by id', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/sadfdsf')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message: 'skill_id must be an integer',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('deleteSkillBySkillId cant connect to database', () => {
        beforeEach(() => {
            var err = new Error('ER_BAD_DB_ERROR');
            err.errorno = '1049';
            err.code = 'ER_BAD_DB_ERROR';
            sinon.stub(skillModel, 'deleteSkillBySkillId').rejects(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return database error_message', (done) => {
            chai.request(app)
                .delete('/api/v1/aws-training-management-system/skill/1')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:
                            'Cannot connect to database / System error.',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                });
        });
    });

    describe('getAllSkills', () => {
        beforeEach(() => {
            sinon.stub(skillModel, 'getReferenceBySkillId').resolves([
                {
                    reference_id: 3,
                    ref_link: 'https://www.youtube.com/watch?v=2bW3HuaAUcY',
                    ref_category: 0,
                    length_in_mins: 12,
                    skill_id: 3,
                },
            ]);
            sinon.stub(skillModel, 'getAllSkills').resolves([
                {
                    skill_id: 3,
                    skill_name: 'MySQL',
                    skill_description: 'A RDBMS...',
                },
            ]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('Able to get all skills', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/all')
                .end((err, response) => {
                    const checkObj = JSON.stringify([
                        {
                            skill_id: 3,
                            skill_name: 'MySQL',
                            skill_description: 'A RDBMS...',
                            references: [
                                {
                                    reference_id: 3,
                                    ref_link:
                                        'https://www.youtube.com/watch?v=2bW3HuaAUcY',
                                    ref_category: 0,
                                    length_in_mins: 12,
                                    skill_id: 3,
                                },
                            ],
                        },
                    ]);
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                });
        });
    });

    describe('getAllSkills cant connect to database', () => {
        beforeEach(() => {
            var err = new Error('ER_BAD_DB_ERROR');
            err.errorno = '1049';
            err.code = 'ER_BAD_DB_ERROR';
            sinon.stub(skillModel, 'getAllSkills').rejects(err);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('return database error_message', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/all')
                .end((err, response) => {
                    const checkObj = JSON.stringify({
                        error_message:
                            'Cannot connect to database / System error.',
                    });
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(503);
                    done();
                });
        });
    });

    describe('getAllSkills no data found case', () => {
        beforeEach(() => {
            sinon.stub(skillModel, 'getAllSkills').resolves([]);
        });

        afterEach((done) => {
            sinon.restore();
            done();
        });

        it('No data found when tried to acquire all skills details.', (done) => {
            chai.request(app)
                .get('/api/v1/aws-training-management-system/skill/all')
                .end((err, response) => {
                    const checkObj = JSON.stringify([]);
                    const responseBody = JSON.stringify(response.body);
                    responseBody.should.be.eql(checkObj);
                    response.should.have.status(200);
                    done();
                });
        });
    });
});

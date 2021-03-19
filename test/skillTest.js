const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../server");
chai.should();
chai.use(chaiHttp);

const sinon = require("sinon");

const skillModel = require("../app/models/skill.model");

describe("Skill API", function () {
  //#region getSkillBySkillId
  describe("getSkillBySkillId", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "getReferenceBySkillId").resolves([
        {
          reference_id: 3,
          ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
          ref_category: 0,
          length_in_mins: 12,
          skill_id: 3,
        },
      ]);
      sinon.stub(skillModel, "getSkillBySkillId").resolves([{ skill_id: 3, skill_name: "MySQL", skill_description: "A RDBMS..." }]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Able to acquire skills based on skill ID.", (done) => {
      chai
        .request(app)
        .get("/api/v1/aws-training-management-system/skill/id/3")
        .end((err, response) => {
          const checkObj = JSON.stringify({
            skill_id: 3,
            skill_name: "MySQL",
            skill_description: "A RDBMS...",
            references: [
              {
                reference_id: 3,
                ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
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

  describe("getSkillBySkillId database error case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "getSkillBySkillId").rejects({});
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Cannot connect to database / System error", (done) => {
      chai
        .request(app)
        .get("/api/v1/aws-training-management-system/skill/id/3")
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: "Cannot connect to database / System error",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(503);
          done();
        });
    });
  });

  describe("getSkillBySkillId record doesnt exist", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "getReferenceBySkillId").resolves([{}]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("record with specified skill_id doesnt exist", (done) => {
      chai
        .request(app)
        .get("/api/v1/aws-training-management-system/skill/id/1")
        .end((err, response) => {
          const checkObj = JSON.stringify({});
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe("getSkillBySkillId no data found case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "getSkillBySkillId").resolves([]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("No data found when tried to acquire skill details based on skill ID.", (done) => {
      chai
        .request(app)
        .get("/api/v1/aws-training-management-system/skill/id/10")
        .end((err, response) => {
          const checkObj = JSON.stringify({});
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });
  //#endregion

  //#region getSkillAll
  describe("getSkillAll", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "getReferenceBySkillId").resolves([
        {
          reference_id: 3,
          ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
          ref_category: 0,
          length_in_mins: 12,
          skill_id: 3,
        },
      ]);
      sinon.stub(skillModel, "getSkillAll").resolves([{ skill_id: 3, skill_name: "MySQL", skill_description: "A RDBMS..." }]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Get all skills available.", (done) => {
      chai
        .request(app)
        .get("/api/v1/aws-training-management-system/skill/all")
        .end((err, response) => {
          const checkObj = JSON.stringify([
            {
              skill_id: 3,
              skill_name: "MySQL",
              skill_description: "A RDBMS...",
              references: [
                {
                  reference_id: 3,
                  ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
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

  describe("getSkillAll database error case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "getSkillAll").rejects({});
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Cannot connect to database / System error", (done) => {
      chai
        .request(app)
        .get("/api/v1/aws-training-management-system/skill/all")
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: "Cannot connect to database / System error",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(503);
          done();
        });
    });
  });

  describe("getSkillAll no data found case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "getSkillAll").resolves([]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("No data found when tried to acquire all skill details.", (done) => {
      chai
        .request(app)
        .get("/api/v1/aws-training-management-system/skill/all")
        .end((err, response) => {
          const checkObj = JSON.stringify({});
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });
  //#endregion

  //#region deleteSkillBySkillId
  describe("deleteSkillBySkillId", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "deleteSkillBySkillId").resolves({
        affectedRows: 1,
      });
      sinon.stub(skillModel, "deleteReferenceBySkillId").resolves({
        affectedRows: 1,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Able to delete skill details by skill ID.", (done) => {
      chai
        .request(app)
        .delete("/api/v1/aws-training-management-system/skill/3")
        .end((err, response) => {
          const checkObj = JSON.stringify({
            deleted: "1",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe("deleteSkillBySkillId database error case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "deleteSkillBySkillId").rejects({});
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Cannot connect to database / System error", (done) => {
      chai
        .request(app)
        .delete("/api/v1/aws-training-management-system/skill/3")
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: "Cannot connect to database / System error",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(503);
          done();
        });
    });
  });

  describe("deleteSkillBySkillId data doesnt exist case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "deleteSkillBySkillId").resolves({
        affectedRows: 0,
      });
      sinon.stub(skillModel, "deleteReferenceBySkillId").resolves({
        affectedRows: 0,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("skill_id doesnt exist in db", (done) => {
      chai
        .request(app)
        .delete("/api/v1/aws-training-management-system/skill/3")
        .end((err, response) => {
          const checkObj = JSON.stringify({
            deleted: "0",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });
  //#endregion

  //#region addSkill
  describe("addSkill", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "addSkill").resolves({
        affectedRows: 1,
      });
      sinon.stub(skillModel, "addReference").resolves({
        affectedRows: 1,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Able to add new skill.", (done) => {
      chai
        .request(app)
        .post("/api/v1/aws-training-management-system/skill")
        .send({
          skill_name: "MySQL",
          skill_description: "A RDBMS...",
          references: [
            {
              ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
              ref_category: 0,
              length_in_mins: 12,
            },
          ],
        })
        .end((err, response) => {
          const checkObj = JSON.stringify({
            added: "1",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe("addSkills wrong data type case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "addSkill").resolves({
        affectedRows: 1,
      });
      sinon.stub(skillModel, "addReference").resolves({
        affectedRows: 1,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("parameter has wrong data type", (done) => {
      chai
        .request(app)
        .post("/api/v1/aws-training-management-system/skill")
        .send({
          skill_name: "MySQL",
          skill_description: "A RDBMS...",
          references: [
            {
              ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
              ref_category: 0,
              length_in_mins: "twelve",
            },
          ],
        })
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: '"references[0].length_in_mins" must be a number',
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(422);
          done();
        });
    });
  });

  describe("addSkill no record added test case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "addSkill").resolves({
        affectedRows: 0,
      });
      sinon.stub(skillModel, "addReference").resolves({
        affectedRows: 0,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("no record added", (done) => {
      chai
        .request(app)
        .post("/api/v1/aws-training-management-system/skill")
        .send({
          skill_name: "MySQL",
          skill_description: "A RDBMS...",
          references: [
            {
              ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
              ref_category: 0,
              length_in_mins: 12,
            },
          ],
        })
        .end((err, response) => {
          const checkObj = JSON.stringify({
            added: "0",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe("addSkill duplicate entry case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "addSkill").rejects({ code: "ER_DUP_ENTRY" });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("skill to be added already exists", (done) => {
      chai
        .request(app)
        .post("/api/v1/aws-training-management-system/skill")
        .send({
          skill_name: "MySQL",
          skill_description: "A RDBMS...",
          references: [
            {
              ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
              ref_category: 0,
              length_in_mins: 12,
            },
          ],
        })
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: "Duplicate entry.",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(409);
          done();
        });
    });
  });
  //#endregion

  //#region updateSkill
  describe("updateSkill missing required parameter case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "updateSkill").resolves({
        affectedRows: 1,
      });
      sinon.stub(skillModel, "updateReference").resolves({
        affectedRows: 1,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Required param has no input", (done) => {
      chai
        .request(app)
        .put("/api/v1/aws-training-management-system/skill/3")
        .send({
          skill_description: "A RDBMS...",
          references: [
            {
              ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
              ref_category: 0,
              length_in_mins: 12,
            },
          ],
        })
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: '"skill_name" is required',
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(422);
          done();
        });
    });
  });

  describe("updateSkill", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "updateSkill").resolves({
        affectedRows: 1,
      });
      sinon.stub(skillModel, "updateReference").resolves({
        affectedRows: 1,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("Able to update skill details.", (done) => {
      chai
        .request(app)
        .put("/api/v1/aws-training-management-system/skill/3")
        .send({
          skill_name: "MySQL",
          skill_description: "A RDBMS...",
          references: [
            {
              ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
              ref_category: 0,
              length_in_mins: 12,
            },
          ],
        })
        .end((err, response) => {
          const checkObj = JSON.stringify({
            updated: "1",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe("updateSkill no record updated case", () => {
    beforeEach(() => {
      sinon.stub(skillModel, "updateSkill").resolves({
        affectedRows: 0,
      });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it("no record updated", (done) => {
      chai
        .request(app)
        .put("/api/v1/aws-training-management-system/skill/3")
        .send({
          skill_name: "MySQL",
          skill_description: "A RDBMS...",
          references: [
            {
              ref_link: "https://www.youtube.com/watch?v=2bW3HuaAUcY",
              ref_category: 1,
              length_in_mins: 12,
            },
          ],
        })
        .end((err, response) => {
          const checkObj = JSON.stringify({
            updated: "0",
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });
  //#endregion
});

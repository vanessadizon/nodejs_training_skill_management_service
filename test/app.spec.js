const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );
const server = require( '../server');

chai.should();

chai.use(chaiHttp);

describe('Skills API', () => {

    /**
     * Test the GET route
     */
    describe("GET all skills", () => {
        it("Should get all skills", (done) => {
            chai.request(server)
            .get("/api/v1/aws-training-management-system/skill/all")
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
            done();
            })
        })
    })

    /**
     * Test the GET (by id) route
     */

    /**
     * Test the POST route
     */

    /**
     * Test the PUT route
     */

    /**
     * Test the DELETE route
     */

});
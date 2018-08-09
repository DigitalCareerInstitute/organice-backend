//During the test the env variable is set to test
let mongoose = require("mongoose");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const scanSchema = require("../models/Scan");
const Scan = mongoose.model("Scan", scanSchema);
let should = chai.should();

chai.use(chaiHttp);
describe('Scans', () => {
	beforeEach((done) => { 
		Scan.remove({}, (err) => {
			done();
		});
	});

	describe('/GET scan', () => {
		it('it should GET all the scans', (done) => {
			chai.request(server)
				.get('/api/scans')
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.message.should.be.eql("Unauthorized");
					done();
				});
		});
	});

});
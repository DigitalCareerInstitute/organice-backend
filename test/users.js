//During the test the env variable is set to test
let mongoose = require("mongoose");
const path = require("path");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
const userSchema = require("../models/User");
const User = mongoose.model("User", userSchema);
let should = chai.should();
chai.use(chaiHttp);

describe("/POST user", () => {

	beforeEach((done) => {
		User.remove({}, (err) => {
			done();
		});
	});

	it("it should not POST a user without password field", done => {
		let user = {
			"name": "tommy",
			"email": "tommy@example.com",
		};
		chai
			.request(server)
			.post("/api/register")
			.send(user)
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a("object");
				res.body.error.should.have.property("name");
				res.body.should.have.property("message");

				res.body.error.name.should.be.eql("MissingPasswordError")
				res.body.message.should.be.eql("Unprocessable entity");
				done();
			});
	});

	it("it should not POST a user without email field", done => {
		let user = {
			"name": "tommy",
			"password": "password123"
		};
		chai
			.request(server)
			.post("/api/register")
			.send(user)
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a("object");
				res.body.error.should.have.property("name");
				res.body.should.have.property("message");
				res.body.error.name.should.be.eql("MissingUsernameError")
				res.body.message.should.be.eql("Unprocessable entity");	
				done();
			});
	});

	it("it should POST a user successful", done => {
		let user = {
			"name": "tommy",
			"email": "tommy@example.com",
			"password": "password123"
		};
		chai
			.request(server)
			.post("/api/register")
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.eql("User registered successfully. Please check the email.");
				done();
			});
	});
});

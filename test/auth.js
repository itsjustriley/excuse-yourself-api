const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const User = require('../models/User');

describe("Auth", function() {
  let user = {
    username: 'newtestuser',
    password: 'newtestpassword'
  };

  after(async function () {
    await User.deleteOne({ username: user.username });
    console.log('User deleted');
    agent.close()
  });

  it("Should be able to sign up", function(done) {
    console.log('user', user)
    agent.post('/signup')
    .send({ username: user.username, password: user.password })
    .end(function(err, res) {
    console.log('res.body', res.body)
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.contain.key('token');
    done();
    }
  )});

  it ("Should not be able to sign up with the same username", function(done) {
    agent.post('/signup')
    .send({ username: user.username, password: user.password })
    .end(function(err, res) {
    res.should.have.status(400);
    res.should.be.json;
    res.body.should.contain.key('error');
    done();
    }
  )});

  it ("Should not be able to sign up with a password less than 8 characters", function(done) {
    agent.post('/signup')
    .send({ username: 'testuser2', password: 'test' })
    .end(function(err, res) {
    res.should.have.status(400);
    res.should.be.json;
    res.body.should.contain.key('error');
    done();
    }
  )});

  it("Should be able to log in", function(done) {
    agent.post('/login')
    .send( { username: user.username, password: user.password })
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.contain.key('token');
    done();
    }
  )});

  it("Should not be able to log in with an invalid username", function(done) {
    agent.post('/login')
    .send({ username: 'random', password: user.password })
    .end(function(err, res) {
    res.should.have.status(401);
    res.should.be.json;
    res.body.should.contain.key('error');
    done();
    }
  )});

  it("Should not be able to log in with an invalid password", function(done) {
    agent.post('/login')
    .send({ username: user.username, password: 'random' })
    .end(function(err, res) {
    res.should.have.status(401);
    res.should.be.json;
    res.body.should.contain.key('error');
    done();
    }
  )});

});



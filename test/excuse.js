const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const User = require('../models/User');
const Excuse = require('../models/excuse');
const jwt = require('jsonwebtoken');

describe("Excuse", function() {
  let token;

  const excuse1 = {excuse: 'I had to walk the dog'};
  let excuse1Id;

  let user = {
    username: 'newtestuser',
    password: 'newtestpassword',
  };

  before (async function (){
    const user = new User({ username: 'newtestuser', password: 'newtestpassword' });
    await user.save();
    console.log('User created:', user);
    token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '1 day' });
    console.log('Token:', token);
  })

  after(async function () {
    await User.deleteOne({ username: user.username });
    console.log('User deleted');
    Excuse.deleteOne({ excuse: excuse1.excuse });
    Excuse.deleteOne({ excuse: 'I had to study for a test' });
    agent.close()
  });


  it("should create a new excuse at /excuse/new POST", function(done) {
    agent.post('/excuse/new')
      .set('Authorization', 'Bearer ' + token)
      .send(excuse1)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.contain.key('excuse');
        excuse1Id = res.body.excuse._id;
        done();
      });
  });

  it("should return a random excuse at /excuse GET", function(done) {
    agent.get('/excuse')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.contain.key('excuse');
        done();
      });
    });

  it("should return a specific excuse at /excuse/:id GET", function(done) {
    agent.get(`/excuse/${excuse1Id}`)
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.excuse.should.have.property('_id').eql(excuse1Id);
        done();
      });
  });

  it("should save an excuse to the user's list at /excuse/:id/save PUT", function(done) {
    agent.put(`/excuse/${excuse1Id}/save`)
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.user.excuses.should.be.a('array');
        res.body.user.excuses.length.should.be.eql(1);
        done();
      });
  });

  it("should return all saved excuses at /excuse/saved GET", function(done) {
    agent.get('/saved')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('excuses').that.is.an('array');
        done();
      });
  });

  it("should delete an excuse at /excuse/:id/delete DELETE", function(done) {
    agent.delete(`/excuse/${excuse1Id}/delete`)
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.message.should.eql('No excuses remaining on list')
        done();
      });
  });
});
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const jwt = require('jsonwebtoken');

describe("API test", function() {
  let token = jwt.sign({ _id: 'test' }, process.env.SECRET, { expiresIn: '60 seconds' });

  after (function(done) {
    token = null;
    agent.close();
    done();
  })

  it("/excuse endpoint is accessible with valid token", function(done) {
    agent
      .get('/excuse')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it("/excuse endpoint is not accessible with invalid token", function(done) {
    agent
      .get('/excuse')
      .end(function(err, res) {
        res.should.have.status(401);
        res.should.be.json;
        done();
      }
    );
  });
});



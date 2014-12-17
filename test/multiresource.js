var multiResource = require('..')
  , express = require('express')
  , resource = require('../lib/resource')
  , should = require('should')
  , nock = require('nock')
  , expressMocks = require('express-mock-request');

'use strict';

describe('Resource', function () {
  it('should create new instance with options', function(done) {
    var Resource = resource.create({
      protocol: 'http',
      url: 'http://google.com',
      key: 'frontpage',
      headers: {
        'X-Requested-With': 'Node-multiresource'
      }
    });
    Resource.protocol.should.eql('http');
    Resource.url.should.eql('http://google.com');
    Resource.key.should.eql('frontpage');
    Resource.headers['X-Requested-With'].should.eql('Node-multiresource');
    done();
  });

  it('should return new resource instance when calling create', function (done) {
    var Resource = resource.create({});
    Resource.should.be.instanceof(resource.Resource);
    done();
  });

  it('should load given URL', function(done) {
    var reply = {
            status: 'ok',
            data: [
              {name: 'Franck', age: 30},
              {name: 'John', age: 25}
            ]
          }

      , API = nock('http://localhost:8080')
        .get('/api/users')
        .reply(200, reply)

      , Resource = resource.create({
          protocol: 'http',
          url: 'http://localhost:8080/api/users',
          key: 'users',
          headers: {}
        });

    Resource.load(function(data) {
      data.key.should.eql('users');
      var json = JSON.parse(data.value);
      json.should.eql(reply);
      done();
    });
  });
});

describe('Multiresource', function() {
  var replyUsers = {
      status: 'ok',
      data: [
        {name: 'Franck', age: 30},
        {name: 'John', age: 25}
      ]
    }
    , replyProjects = {
      status: 'ok',
      data: [
        {name: 'Project 1', dueDate: 'Friday'},
        {name: 'Project 2', dueDate: 'Tuesday'}
      ]
    }
    , app = express();
  app.use( '/resource', multiResource() );

  app.get('/users/:id?', function(req, res) {
    res.json(replyUsers);
  });

  app.get('/projects/:id?', function(req, res) {
    res.json(replyProjects);
  });

  it('should load multiple resources', function(done) {
    expressMocks(app).get('/resource?users=users&projects=projects').expect(function(response) {
      should.exist(response.body);

      var json = JSON.parse(response.body)
         , usr = JSON.parse(json['users'])
        , prj = JSON.parse(json['projects']);
      usr.should.eql(replyUsers);
      prj.should.eql(replyProjects);
      done();
    });
  });
});
var multiresource = require('../lib/multiresource')
  , resource = require('../lib/resource')
  , httpMocks = require('node-mocks-http')
  , should = require('should');

'use strict';

describe('Resource', function () {
  it('should create new instance with options', function(done) {
    var Resource = resource.create({});
    Resource.should.be.instanceof(resource.Resource);
    done();
  });

  it('should return new resource instance when calling create', function (done) {
   done();
  });

  it('should load given URL', function(done) {
    done();
  });
});

describe('Multiresource', function() {
  it('should load multiple resources', function(done) {
    done();
  });

  it('should apply itself to given url, or bypass the call', function(done) {
    done();
  });

  it('should apply parse function if given', function(done) {
    done();
  });
});
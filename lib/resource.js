'use strict';

// hack to go through https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var stream = require('stream')
  , http = require('http')
  , https = require('https')
  , util = require('util');

var Resource = function(data) {

  var self = this
    , _defaults = {
      protocol: 'http',
      url: '',
      headers: {},
      key: 'default'
    };

  self.ResponseDataStream = new stream.Writable()
  self.responseData = new Buffer('');
  self.ResponseDataStream._write = function(chunk, encoding, cb) {
    var buff = (Buffer.isBuffer(chunk)) ? chunk: new Buffer(chunk, encoding);
    self.responseData = Buffer.concat([self.responseData, buff]);
    cb();
  };

  self.protocol = data.protocol || _defaults.protocol;
  self.url = data.url || _defaults.url;
  self.headers = data.headers || _defaults.headers;
  self.key = data.key || _defaults.key;
};

Resource.prototype.load = function(callback) {
  var self = this
    , _callback = callback || function() {}
    , connectionLibrary = self.protocol === 'https' ? https: http
    , request = connectionLibrary.request( self.url );

  for (var h in self.headers) {
    request.setHeader(h, self.headers[h]);
  }

  request.on('response', function(response){
    response.pipe(self.ResponseDataStream);
    response.on('end', function() {
      _callback( { key: self.key, value: self.responseData.toString() } );
      return;
    });
    response.on('error', function(err) {
      _callback( { key: self.key, value: err } );
      return;
    });
  });
  request.end();
};

exports.create = function(props) {
  return new Resource(props);
}
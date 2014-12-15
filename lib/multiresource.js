/**
 * ExpressJs 4.x.x middleware for getting multiple resources in one go
 *
 * @usage
 * app.use('/api/someurl', require('./multiresource')() )
 * app.use( require('./multiresource')({ url: '/api/someurl', parse: function(input) { return JSON.parse(input); } } ) )
 *
 * @param String url
 *
 * @param Function parse
 *
 * @author
 * Sergii Tsegelnyk
 *
 * @license MIT
 * 
 */
'use strict';

var resource = require('./resource');

module.exports = function( params ) {

  var interceptUrl = params.url
    , parseFn = params.parse;

  return function(req, res, next) {

    if (interceptUrl && !req.route.match(interceptUrl) ) {
      next();
      return;
    }

    var callbacksFired = 0
      , apiCalls = Object.keys(req.query)
      , callbacksTotal = apiCalls.length
      , aggregatedResponse = {}
      , route
      , headers = req.headers;

      
      for (var i = 0, l=callbacksTotal; i<l; i++) {
        route = req.protocol + '://' + req.headers.host + '/' + req.query[apiCalls[i]];

        resource
          .create({
            protocol: req.protocol,
            url: route,
            headers: headers,
            key: apiCalls[i]
          })
          .load( function(d) {
            aggregatedResponse[d.key] = parseFn ? parseFn( d.value ) : d.value;
            callbacksFired += 1;
            if ( callbacksFired === callbacksTotal ) {
              res.json(aggregatedResponse);
            }
        });
      }
  };
}
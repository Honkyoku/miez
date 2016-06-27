'use strict';

module.exports = {
  port: 3001,
  hostname: '127.0.0.1',
  baseUrl: 'http://localhost:3001',
  mongodb: {
    uri: 'mongodb://localhost/miez_test_db'
  },
  app: {
    name: 'miez'
  },
  serveStatic: true,
  session: {
    type: 'mongo',                          // store type, default `memory`
    secret: 'someVeRyN1c3S#cr3tHer34U',
    resave: false,                          // save automatically to session store
    saveUninitialized: true                 // saved new sessions
  },
  proxy: {
    trust: true
  },
  swig: {
    cache: false
  },
};

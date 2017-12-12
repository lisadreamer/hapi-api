'use strict';

const Hapi = require('hapi');
const uuid = require('node-uuid');

//Create server and connection
const server = new Hapi.Server();
server.connection({
  port: 3000
});

//Register good plugin and start the server
server.register(
  [
    {
      register: require('good'),
      options: {
        reporters: {
          console: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [
                {
                  log: '*',
                  response: '*'
                }
              ]
            },
            {
              module: 'good-console'
            },
            'stdout'
          ]
        }
      }
    },
    {
      register: require('hapi-auth-bearer-token')
    },
    {
      register: require('./plugins/db')
    },
    {
      register: require('./plugins/auth')
    },
    {
      register: require('./routes/bookmarks')
    },
    {
      register: require('./routes/auth')
    },
    {
      register: require('blipp')
    }
  ],
  err => {
    if (err) {
      throw err;
    }

    // Starting the server
    server.start(err => {
      if (err) {
        throw err;
      }

      console.log('Server running at:', server.info.uri);
    });
  }
);

#!/usr/bin/env node
/*
 * Clustering
 */
//var cluster = require('cluster');
import cluster from 'cluster';

import app from '../app.js';    //var app = require('../app');
//var debug = require('debug')('node_app:server');
import debugClass from 'debug';
const debug = debugClass('node_app:server');

import http from 'http'; //    var http = require('http');

import {sequelize} from '../server/models/index.js'; //var models = require("../server/models");
import os from 'os';

if (cluster.isPrimary)
{
    // Count the machine's CPUs
    const cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

} else {



    /**
     * Get port from environment and store in Express.
     */

    var port = '3000';
    app.set('port', port);

    /**
     * Create HTTP server.
     */
    sequelize.sync().then(function () {

      var server = http.createServer(app);

      /**
       * Listen on provided port, on all network interfaces.
       */
      server.listen(port);
      server.on('error', onError);
      server.on('listening', onListening);

      /**
       * Event listener for HTTP server "error" event.
       */

      function onError(error) {
        if (error.syscall !== 'listen') {
          throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
          default:
            throw error;
        }
      }

      /**
       * Event listener for HTTP server "listening" event.
       */
      function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
      }
    });


    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }
}

'use strict';

module.exports = envTransports;

function envTransports(winston) {
  return [
    new winston.transports.Console()
  ];
}

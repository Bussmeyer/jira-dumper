const config = require('../config');
const util = require('util')

var loggy = function(logVar){
  if (config.debug) {
    console.log(util.inspect(logVar, {showHidden: false, depth: null}));
  }
}

module.exports = loggy;

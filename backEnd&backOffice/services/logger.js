const winston = require('winston');
require('winston-mongodb').MongoDB;
require('winston-mail').Mail;
const config = require('../config/logger.js');

const generateTransportOptions = (level, logLevelConfig, transportConfig) => {
  let options = {
    level: level
  };

  for(key in logLevelConfig)
    options[key] = logLevelConfig[key];

  for(key in transportConfig)
    options[key] = transportConfig[key];

  return options;
};

var loggers = {};

for(aLevelKey in config.levels){
  let logger = new (winston.Logger)({exitOnError: false});
  logger.setLevels(winston.config.syslog.levels);
  loggers[aLevelKey] = logger[aLevelKey];

  let currentLevel = config.levels[aLevelKey];

  for(aTransportKey in currentLevel) {
    if(currentLevel[aTransportKey].useIt) {
      if (aTransportKey == 'console')
        logger.add(winston.transports.Console, generateTransportOptions(aLevelKey, currentLevel[aTransportKey], config.connectionConfig[aTransportKey]));
      if (aTransportKey == 'mail')
        logger.add(winston.transports.Mail, generateTransportOptions(aLevelKey, currentLevel[aTransportKey], config.connectionConfig[aTransportKey]));
      if (aTransportKey == 'mongo')
        logger.add(winston.transports.MongoDB, generateTransportOptions(aLevelKey, currentLevel[aTransportKey], config.connectionConfig[aTransportKey]));
    }
  }
}

module.exports = loggers;


const env = process.env.NODE_ENV || 'development';

const useMongoDB = (envVar) => envVar == 'true';
const useMailSender = (envVar) => envVar != undefined && envVar != null && envVar != '';
const useConsole = (envVar) => envVar == 'true';

const config = {
  development: {
    connectionConfig: {
      console: {}
    },
    levels: {
      unhandleExceptions: {
        console: {
          handleExceptions: true,
          humanReadableUnhandledException: true,
          useIt: true
        }
      },
      emerg: {
        console: {
          useIt: true
        }
      },
      alert: {
        console: {
          useIt: true
        }
      },
      crit: {
        console: {
          useIt: true
        }
      },
      error: {
        console: {
          useIt: true
        }
      },
      warning: {
        console: {
          useIt: true
        }
      },
      notice: {
        console: {
          useIt: true
        }
      },
      info: {
        console: {
          useIt: true
        }
      },
      debug: {
        console: {
          useIt: true
        }
      }
    }
  },
  production: {
    connectionConfig: {
      mongo: {
        db: process.env.LOGGER_MONGODB,
      },
      mail: {
        from: process.env.LOGGER_MAIL_FROM,
        host: process.env.LOGGER_MAIL_HOST,
        port: process.env.LOGGER_MAIL_PORT,
        ssl: process.env.LOGGER_MAIL_SSL,
        tls: process.env.LOGGER_MAIL_TLS,
        username: process.env.LOGGER_MAIL_USERNAME,
        password: process.env.LOGGER_MAIL_PASSWORD,
        timeout: 60000
      }
    },
    levels: {
      unhandleExceptions: {
        console: {
          handleExceptions: true,
          humanReadableUnhandledException: true,
          useIt: useConsole(process.env.LOGGER_UNHANDLE_EXCEPTIONS_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Excepcion',
          capped: false,
          handleExceptions: true,
          useIt: useMongoDB(process.env.LOGGER_UNHANDLE_EXCEPTIONS_USE_MONGO)
        },
        mail: {
          subject: 'Excepcion',
          to: process.env.LOGGER_UNHANDLE_EXCEPTIONS_MAIL_TO,
          handleExceptions: true,
          humanReadableUnhandledException: true,
          useIt: useMailSender(process.env.LOGGER_UNHANDLE_EXCEPTIONS_MAIL_TO)
        }
      },
      emerg: {
        console: {
          useIt: useConsole(process.env.LOGGER_EMERG_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Emergencia',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_EMERG_USE_MONGO)
        },
        mail: {
          subject: 'Emergencia',
          to: process.env.LOGGER_EMERG_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_EMERG_MAIL_TO)
        }
      },
      alert: {
        console: {
          useIt: useConsole(process.env.LOGGER_ALERT_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Alerta',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_ALERT_USE_MONGO)
        },
        mail: {
          subject: 'Alerta',
          to: process.env.LOGGER_ALERT_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_ALERT_MAIL_TO)
        }
      },
      crit: {
        console: {
          useIt: useConsole(process.env.LOGGER_CRIT_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Critico',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_CRIT_USE_MONGO)
        },
        mail: {
          subject: 'Critico',
          to: process.env.LOGGER_CRIT_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_CRIT_MAIL_TO)
        }
      },
      error: {
        console: {
          useIt: useConsole(process.env.LOGGER_ERROR_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Error',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_ERROR_USE_MONGO)
        },
        mail: {
          subject: 'Error',
          to: process.env.LOGGER_ERROR_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_ERROR_MAIL_TO)
        }
      },
      warning: {
        console: {
          useIt: useConsole(process.env.LOGGER_WARNING_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Advertencia',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_WARNING_USE_MONGO)
        },
        mail: {
          subject: 'Advertencia',
          to: process.env.LOGGER_WARNING_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_WARNING_MAIL_TO)
        }
      },
      notice: {
        console: {
          useIt: useConsole(process.env.LOGGER_NOTICE_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Noticia',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_NOTICE_USE_MONGO)
        },
        mail: {
          subject: 'Noticia',
          to: process.env.LOGGER_NOTICE_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_NOTICE_MAIL_TO)
        }
      },
      info: {
        console: {
          useIt: useConsole(process.env.LOGGER_INFO_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Informacion',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_INFO_USE_MONGO)
        },
        mail: {
          subject: 'Informacion',
          to: process.env.LOGGER_INFO_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_INFO_MAIL_TO)
        }
      },
      debug: {
        console: {
          useIt: useConsole(process.env.LOGGER_DEBUG_CONSOLE),
          colorize: true,
          timestamp: true
        },
        mongo: {
          tryReconnect: env == 'production' ? true : false,
          options: {poolSize: 5, autoReconnect: env == 'production' ? true : false},
          collection: 'Debug',
          capped: false,
          useIt: useMongoDB(process.env.LOGGER_DEBUG_USE_MONGO)
        },
        mail: {
          subject: 'Debug',
          to: process.env.LOGGER_DEBUG_MAIL_TO,
          useIt: useMailSender(process.env.LOGGER_DEBUG_MAIL_TO)
        }
      }
    }
  }
};

module.exports = config[env];

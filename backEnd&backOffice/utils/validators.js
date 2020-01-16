const helpers = require('./helpers');

const validator = (rule, errorMessage) => value => {
  if (!rule(value)) {
    throw new Error(errorMessage);
  }
};

const cpa = validator(
  helpers.isCpa,
  'Invalid zip code. It should be a CPA code'
);
const cuit = validator(helpers.isCuit, 'Invalid CUIT');

module.exports = {
  validator,
  cpa,
  cuit
};

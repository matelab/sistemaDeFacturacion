const _ = require('lodash');

const isCpa = str => /^([a-z]{1})?\d{4}([a-z]{3})?$/i.test(str);

const isCuit = str => {
  const cuitSize = 11;

  if (!str) {
    return true;
  }

  if (str.length !== cuitSize) {
    return false;
  }

  const digits = str.split('').map(n => parseInt(n));
  const lastDigit = digits.pop();
  const accum = _.reduce(
    digits,
    (accum, value, index) => accum + digits[9 - index] * (2 + index % 6),
    0
  );
  let verifier = cuitSize - accum % cuitSize;
  verifier = verifier === cuitSize ? 0 : verifier;

  return lastDigit === verifier;
};

const padStartZero = (strOrNum, times) => _.padStart(strOrNum, times, '0');

const formatedStringify = obj => JSON.stringify(obj, null, 2);

module.exports = {
  formatedStringify,
  padStartZero,
  isCpa,
  isCuit
};

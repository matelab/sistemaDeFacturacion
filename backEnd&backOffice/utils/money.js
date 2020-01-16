const formatter = require('format-number');
const defaultFormatter = formatter({
  integerSeparator: '.',
  decimal: ',',
  padRight: 2
});
const round = number => Math.round(number * 100 + Number.EPSILON) / 100;

class Money {
  constructor(amount = 0, formatter = defaultFormatter) {
    this.amount = round(amount); //We force the rounding on creation
    this.formatter = formatter;
  }

  plus(money = 0) {
    return new Money(this.amount + money.amount);
  }

  minus(money) {
    this.plus(-money);
  }

  multiply(scalar = 1) {
    return new Money(this.amount * scalar);
  }

  toString() {
    return this.formatter(this.amount);
  }
}

module.exports = Money;

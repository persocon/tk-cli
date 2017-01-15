class Utils {
  getNumbers(input) {
    var m = input.match(/[0-9]+/g);
    m = m.join('.');
    return m;
  }

  getPrefix(input) {
    var m = input.match(/[a-zA-Z]+/g);
    return m !== null ? m : '';
  }
}

module.exports = Utils;

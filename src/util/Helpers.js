module.exports = class Helpers {
  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  static randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
};

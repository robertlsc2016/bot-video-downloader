let start = null;

const startTimer = async () => {
  start = process.hrtime();
};

const getStartValue = async () => {
  return start;
};

module.exports = {
  startTimer,
  getStartValue,
};

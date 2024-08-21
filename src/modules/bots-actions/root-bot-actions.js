module.exports.rootBotActions = async function ({ action }) {
  const pathToStatisticJson = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "data",
    "states.json"
  );

  switch (action) {
    case "turnoff":
      return "turnoff";
  }
};

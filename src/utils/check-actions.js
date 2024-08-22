const fs = require("fs");
const path = require("path");

const pathToStatesJson = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "states.json"
);

module.exports.checkActions = async function ({ typeAction }) {
  const rawData = fs.readFileSync(pathToStatesJson, "utf8");
  let rootActions = JSON.parse(rawData);

  switch (typeAction) {
    case "bot_active":
      const state = rootActions.bot_active == 1 ? true : false;
      return state;
  }
};

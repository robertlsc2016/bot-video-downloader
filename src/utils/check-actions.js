const fs = require("fs");
const { pathTo } = require("./path-orchestrator");

const pathToStatesJson = pathTo.pathToStatesJson;

module.exports.checkActions = async function ({ typeAction }) {
  const rawData = fs.readFileSync(pathToStatesJson, "utf8");
  let rootActions = JSON.parse(rawData);

  switch (typeAction) {
    case "bot_speedtest":
      const state = rootActions.bot_speedtest == 1 ? true : false;
      return state;
  }

  switch (typeAction) {
    case "bot_active":
      const state = rootActions.bot_active == 1 ? true : false;
      return state;
  }
};

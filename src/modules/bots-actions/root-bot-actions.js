const fs = require("fs");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { pathTo } = require("../../utils/path-orchestrator");

module.exports.rootBotActions = async function ({ action }) {
  const pathToStatesJson = pathTo.pathToStatesJson;

  const rawData = fs.readFileSync(pathToStatesJson, "utf8");
  let rootActions = JSON.parse(rawData);

  switch (action) {
    case "turnon":
      if (rootActions.bot_active == 1) {
        return await genericSendMessageOrchestrator({
          type: "text",
          msg: "Já estou ligado :)",
        });
      }

      rootActions.bot_active = 1;
      fs.writeFileSync(pathToStatesJson, JSON.stringify(rootActions, null, 2));
      await genericSendMessageOrchestrator({
        type: "text",
        msg: "Fui religado!",
      });
      break;

    case "turnoff":
      if (rootActions.bot_active == 0) {
        return await genericSendMessageOrchestrator({
          type: "text",
          msg: "Já estou desligado :)",
        });
      }
      rootActions.bot_active = 0;
      await genericSendMessageOrchestrator({
        type: "text",
        msg: "Fui desligado, até mais!",
      });
      fs.writeFileSync(pathToStatesJson, JSON.stringify(rootActions, null, 2));
      break;
  }
};

const { bot_actions } = require("../../utils/constants");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");
const { structuredMessages } = require("../../utils/structured-messages");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.IsTrue = async function ({ msg: message }) {
  monitorUsageActions({
    action: "is_true",
  });
  if (message.replace(bot_actions.is_true, "").replace("?", "").trim() == "") {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: structuredMessages.emptyMessageIstrue,
    });
  }

  const extremePositiveMessage = structuredMessages.extremePositiveMessage;
  const positiveMessage = structuredMessages.positiveMessage;
  const negativeMessage = structuredMessages.negativeMessage;
  const doubtMessage = structuredMessages.doubtMessage;
  const acusationMessage = structuredMessages.acusationMessage;

  const randomNumber = Math.random();
  let selectMessage;

  if (randomNumber < 0.1) {
    selectMessage = extremePositiveMessage;
  } else if (randomNumber < 0.4) {
    selectMessage = positiveMessage;
  } else if (randomNumber < 0.7) {
    selectMessage = negativeMessage;
  } else if (randomNumber < 0.8) {
    selectMessage = doubtMessage;
  } else {
    selectMessage = acusationMessage;
  }

  await genericSendMessageOrchestrator({
    type: "text",
    msg: selectMessage,
  });
};

const { getGroupID } = require("../../settings/select-group");
const { client } = require("../../settings/settings");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.mentionAll = async function ({ message }) {
  monitorUsageActions({
    action: "mention_all",
  });
  const chat = await client.getChatById(await getGroupID());
  const participants = chat.participants;

  let clearMessage = `${message.replace(/@todos/g, "").trim()}\n\n`;

  const messageWithUsers = participants.map((user) => {
    clearMessage += `@${user.id.user} `;
  });

  const getUsersForMentions = participants.map(
    (user) => user.id.user + "@c.us"
  );

  return await genericSendMessageOrchestrator({
    msg: clearMessage,
    type: "text",
    situation: "mentions",
    mentions: getUsersForMentions,
  });
};

const { getGroupID } = require("../../settings/select-group");
const { client } = require("../../settings/settings");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.whoIs = async function () {
  monitorUsageActions({
    action: "who_is",
  });

  const chat = await client.getChatById(await getGroupID());
  const participants = chat.participants;

  function chooseRandomParticipant(participants) {
    if (participants.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * participants.length);
    return participants[randomIndex];
  }

  const randomParticipant = await chooseRandomParticipant(participants);

  await client.sendMessage(
    await getGroupID(),
    `essa pessoa: @${randomParticipant.id.user}, com certeza`,
    {
      mentions: [`${randomParticipant.id.user}@${randomParticipant.id.server}`],
    }
  );
  await client.sendMessage(await getGroupID(), "bot nunca erra 😎");
};

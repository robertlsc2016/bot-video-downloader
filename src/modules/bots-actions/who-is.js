const { stringToGroup } = require("../../settings/necessary-settings");
const { client } = require("../../settings/settings");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.whoIs = async function () {
  const chat = await client.getChatById(stringToGroup);
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
    stringToGroup,
    `essa pessoa: @${randomParticipant.id.user}, com certeza`,
    {
      mentions: [`${randomParticipant.id.user}@${randomParticipant.id.server}`],
    }
  );
  await client.sendMessage(
    stringToGroup, "bot nunca erra 😎"
  );
};

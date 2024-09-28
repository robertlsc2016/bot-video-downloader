const fs = require("fs");
const { client } = require("../../settings/settings");
const { stringToGroup } = require("../../settings/necessary-settings");
const { pathTo } = require("../../utils/path-orchestrator");
const logger = require("../../logger");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");

const pathToStatisticJson = pathTo.pathToStatisticJson;

const checkFileExist = async function () {
  if (!fs.existsSync(pathToStatisticJson)) {
    const chat = await client.getChatById(stringToGroup);
    const participants = chat.participants;
    await createStructure({ participants: participants });
  }
};

const createStructure = async () => {
  const chat = await client.getChatById(stringToGroup);
  const participants = chat.participants;

  const participants_structure = [];

  participants.map((participant) => {
    participants_structure.push({
      user: participant.id.user,
      number_participations: 0,
    });
  });

  const participantsJson = JSON.stringify({ participants_structure }, null, 2);

  fs.writeFileSync(pathToStatisticJson, participantsJson, (err) => {
    if (err) {
      logger.error("Erro ao salvar o arquivo JSON:", err);
    } else {
      logger.info("Arquivo JSON salvo com sucesso!");
    }
  });
};

const addParticipation = async ({ message }) => {
  await checkFileExist();
  const participant = message._data.id.participant.replace("@c.us", "");

  const rawData = fs.readFileSync(pathToStatisticJson, "utf8");
  let users = JSON.parse(rawData);

  for (let user of users.participants_structure) {
    if (user.user == participant) {
      user.number_participations += 1;
      return fs.writeFileSync(
        pathToStatisticJson,
        JSON.stringify(users, null, 2)
      );
    }
  }
  return notFoundParticipant({ participant: participant });
};

const notFoundParticipant = async ({ participant: participantNumber }) => {
  await checkFileExist();

  const rawData = fs.readFileSync(pathToStatisticJson, "utf8");
  let users = JSON.parse(rawData);

  const newUser = {
    user: participantNumber,
    number_participations: 1,
  };

  users.participants_structure.push(newUser);
  fs.writeFileSync(pathToStatisticJson, JSON.stringify(users, null, 2));
};

const showStatistics = async function () {
  monitorUsageActions({
    action: "bot_statistics",
  });
  await checkFileExist();

  const rawData = fs.readFileSync(pathToStatisticJson, "utf8");
  let users = JSON.parse(rawData);

  const orderUserMostParticipations = users.participants_structure.sort(
    (a, b) => b.number_participations - a.number_participations
  );

  let message = "Ranking de participantes com mais interações:\n\n";
  orderUserMostParticipations.map((participant, index) => {
    message += `${index + 1}. @${participant.user}\nnúmero de interações: ${
      participant.number_participations
    }\n`;
  });

  const getUsersForMentions = users.participants_structure.map(
    (user) => user.user + "@c.us"
  );

  return await genericSendMessageOrchestrator({
    type: "text",
    situation: "mentions",
    msg: message,
    mentions: getUsersForMentions,
  });

  await client.sendMessage(stringToGroup, message, {
    mentions: getUsersForMentions,
  });
};

const resetStatistics = async () => {
  genericSendMessageOrchestrator({
    type: "text",
    msg: "Resetando todas as estatísticas!",
  });
  return await createStructure();
};

module.exports = {
  showStatistics,
  addParticipation,
  resetStatistics,
};

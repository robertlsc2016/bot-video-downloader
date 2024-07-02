const fs = require("fs");
const path = require("path");
const { client } = require("../../settings/settings");
const { stringToGroup } = require("../../settings/necessary-settings");

const pathToStatisticJson = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "data",
  "statistics.json"
);

module.exports.botStatitics = async function ({ msg: message }) {
  const participant = message._data.id.participant.replace("@c.us", "");

  if (!fs.existsSync(pathToStatisticJson)) {
    const chat = await client.getChatById(stringToGroup);
    const participants = chat.participants;
    await createStructure({ participants: participants });
  }

  addParticipation({ participant: participant });
};

const createStructure = async ({ participants }) => {
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
      console.error("Erro ao salvar o arquivo JSON:", err);
    } else {
      console.log("Arquivo JSON salvo com sucesso!");
    }
  });
};

const addParticipation = async ({ participant: participantNumber }) => {
  const rawData = fs.readFileSync(pathToStatisticJson, "utf8");
  let users = JSON.parse(rawData);

  for (let user of users.participants_structure) {
    if (user.user == participantNumber) {
      user.number_participations += 1;
      return fs.writeFileSync(
        pathToStatisticJson,
        JSON.stringify(users, null, 2)
      );
    }
  }
  return notFoundParticipant({ participant: participantNumber });
};

const notFoundParticipant = async ({ participant: participantNumber }) => {
  const rawData = fs.readFileSync(pathToStatisticJson, "utf8");
  let users = JSON.parse(rawData);

  const newUser = {
    user: participantNumber,
    number_participations: 1,
  };

  users.participants_structure.push(newUser);
  fs.writeFileSync(pathToStatisticJson, JSON.stringify(users, null, 2));
};

module.exports.showStatistics = async function () {
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

  await client.sendMessage(stringToGroup, message, {
    mentions: getUsersForMentions,
  });
};

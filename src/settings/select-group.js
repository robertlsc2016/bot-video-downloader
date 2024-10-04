const { client } = require("../settings/settings");
const fs = require("fs");
const { pathTo } = require("../utils/path-orchestrator");
const readline = require("readline");
const logger = require("../logger");

const selectGroup = async () => {
  if (fs.existsSync(pathTo.pathToSelectGroupJson)) {
    const rawData = fs.readFileSync(pathTo.pathToSelectGroupJson, "utf8");
    let infos = JSON.parse(rawData);

    if(infos.STRING_TO_GROUP_WWEBJS != ""){
      return;
    }
  }

  let groupSelected = false;
  let selectedGroup = "";

  if (!fs.existsSync(pathTo.pathToSelectGroupJson)) {
    const initialStructure = JSON.stringify(
      { STRING_TO_GROUP_WWEBJS: "" },
      null,
      2
    );

    fs.writeFileSync(pathTo.pathToSelectGroupJson, initialStructure, (err) => {
      if (err) {
        logger.error("Erro ao salvar o arquivo JSON:", err);
      } else {
        logger.info("Arquivo JSON salvo com sucesso!");
      }
    });
  }

  const chats = await client.getChats();
  const groups = chats.filter((chat) => chat.isGroup);

  console.log(`Grupos disponíveis: `);

  while (!groupSelected) {
    groups.forEach((group, index) => {
      console.log(
        `[${index + 1}] Grupo: ${group.name} - ID: ${group.id._serialized}`
      );
    });

    const answer = await getValue();

    if (answer - 1 >= 0 && answer - 1 < groups.length) {
      selectedGroup = groups[answer - 1];
      groupSelected = true;

      logger.info(selectedGroup.groupMetadata.id);
    } else {
      logger.error("Número inválido! Insira um valor válido.\n");
    }
  }

  const rawData = fs.readFileSync(pathTo.pathToSelectGroupJson, "utf8");

  let infos = JSON.parse(rawData);
  infos.STRING_TO_GROUP_WWEBJS = selectedGroup.groupMetadata.id._serialized;

  fs.writeFileSync(
    pathTo.pathToSelectGroupJson,
    JSON.stringify(infos, null, 2)
  );

  logger.info(
    `Grupo selecionado: ${selectedGroup.groupMetadata.id._serialized}`
  );
};

const getValue = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "Digite o número do grupo que você deseja utilizar o bot: ",
      (answer) => {
        rl.close();
        resolve(parseInt(answer)); // Converte a resposta para número
      }
    );
  });
};

module.exports = {
  selectGroup,
};

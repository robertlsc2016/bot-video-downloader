// O USUÁRIO ESTÁ NO GRUPO?

const {
  genericSendMessageOrchestrator,
} = require("../modules/generic-sendMessage-orchestrator.module");
const { ADMINSBOT } = require("../settings/feature-enabler");
const { pathTo } = require("./path-orchestrator");
const fs = require("fs");

const regexNumber = /@\d{12,13}(?!\d)/;

const createStructure = async () => {
  const structure = {
    users: [],
  };

  const initialStructure = JSON.stringify(structure, null, 2);

  fs.writeFileSync(pathTo.pathToBlockListJson, initialStructure, (err) => {
    if (err) {
      logger.error("Erro ao salvar o arquivo JSON:", err);
    } else {
      logger.info("Arquivo JSON salvo com sucesso!");
    }
  });
};

const addUserBlockList = async ({ msg }) => {
  const pathBlockListJson = pathTo.pathToBlockListJson;
  if (!fs.existsSync(pathBlockListJson)) createStructure();

  const contact_number = checkValidNumber({ msg: msg });

  if (!contact_number) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "formato de número inválido para adicionar na blocklist!",
    });
  }

  const rawBlockList = fs.readFileSync(pathBlockListJson, "utf8");
  let users_block_list = JSON.parse(rawBlockList);

  if (ADMINSBOT.includes(contact_number + "@c.us")) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "este usuário é admin e não pode ser inserido na blocklist",
    });
  }

  if (users_block_list.users.includes(contact_number)) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "Esse usuário já se encontra na blocklist",
    });
  } else {
    users_block_list.users.push(contact_number);
    fs.writeFileSync(
      pathBlockListJson,
      JSON.stringify(users_block_list, null, 2)
    );
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "Usuário inserido na blocklist!",
    });
  }
};

const removeUserBlockList = async ({ msg }) => {
  const pathBlockListJson = pathTo.pathToBlockListJson;
  if (!fs.existsSync(pathBlockListJson)) createStructure();

  const contact_number = checkValidNumber({ msg: msg });

  if (!contact_number) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "formato de número inválido!",
    });
  }

  const rawBlockList = fs.readFileSync(pathBlockListJson, "utf8");
  let users_block_list = JSON.parse(rawBlockList);

  if (!users_block_list.users.includes(contact_number)) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "este usuário NÃO está na blocklist",
    });
  } else {
    users_block_list.users = users_block_list.users.filter(
      (user) => user !== contact_number
    );

    fs.writeFileSync(
      pathBlockListJson,
      JSON.stringify(users_block_list, null, 2)
    );

    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "usuário removido da blocklist",
    });
  }
};

const checkValidNumber = ({ msg }) => {
  const is_valid_number = regexNumber.test(msg);

  if (!is_valid_number) {
    return false;
  }

  return msg.match(regexNumber)[0].replace("@", "");
};

const showBlockList = async () => {
  const pathBlockListJson = pathTo.pathToBlockListJson;
  if (!fs.existsSync(pathBlockListJson)) createStructure();

  const rawBlockList = fs.readFileSync(pathBlockListJson, "utf8");
  let users_block_list = JSON.parse(rawBlockList);
  const adjust_users_blocklist = users_block_list.users.map((user) => {
    return user + "@c.us";
  });

  let message = "Usuários na lista de bloqueio:\n";
  users_block_list.users.map((user) => {
    message += `- @${user}\n`;
  });

  if (users_block_list.users.length == 0) {
    message = "Não existem usuário na blocklist! ";
  }

  return await genericSendMessageOrchestrator({
    situation: "mentions",
    type: "text",
    msg: message,
    mentions: adjust_users_blocklist,
  });
};

const resetBlockList = async () => {
  createStructure();

  return await genericSendMessageOrchestrator({
    type: "text",
    msg: "Usuários em blocklist resetados!",
  });
};

const isOnBlockList = async ({ user }) => {
  const pathBlockListJson = pathTo.pathToBlockListJson;
  if (!fs.existsSync(pathBlockListJson)) createStructure();

  const userClean = user.replace("@c.us", "");

  const rawBlockList = fs.readFileSync(pathBlockListJson, "utf8");
  let users_block_list = JSON.parse(rawBlockList);

  return users_block_list.users.includes(userClean);
};

module.exports = {
  addUserBlockList,
  removeUserBlockList,
  showBlockList,
  resetBlockList,
  isOnBlockList,
};

const { prefixBot } = require("../../settings/necessary-settings");
const { getGroupID } = require("../../settings/select-group");
const { client } = require("../../settings/settings");
const { pathTo } = require("../../utils/path-orchestrator");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

const pathToFortuneBotJson = pathTo.pathToFortuneBot;
const fs = require("fs");

const symbols = ["🐅", "💰", "🍀", "🔔", "⭐", "🍒"];

const checkFileExist = async function () {
  if (!fs.existsSync(pathToFortuneBotJson)) {
    const chat = await client.getChatById(await getGroupID());
    await createStructure();
  }
};

const createStructure = async () => {
  const chat = await client.getChatById(await getGroupID());
  const participants = chat.participants;

  const betters = [];

  participants.map((participant) => {
    betters.push({
      betterId: participant.id.user,
      balance: 100,
    });
  });

  const bettersJson = JSON.stringify({ betters_structure: betters }, null, 2);

  fs.writeFileSync(pathToFortuneBotJson, bettersJson, (err) => {
    if (err) {
      logger.error("Erro ao salvar o arquivo JSON:", err);
    } else {
      logger.info("Arquivo JSON salvo com sucesso!");
    }
  });
};

const fortuneBot = async ({ betterId, msgBody }) => {
  await checkFileExist();

  const regexAmountValue = /fortune\s(\d{1,4})$/;
  let amount = msgBody.match(regexAmountValue)?.[1];

  if (msgBody == `${prefixBot} fortune`) {
    amount = 1;
  }


  if(amount == '0'){
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: `Você não pode apostar R$ 0`,
    });
  }

  if (!amount) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: `Eu aceito apenas apostas com números inteiros ou até R$ 9999. Exemplo: *${prefixBot} fortune 10*`,
    });
  }

  const formattedId = betterId.replace("@c.us", "");

  const exists = await doesBetterExist(formattedId);
  if (!exists) {
    await addBetter({ betterId: formattedId });
  }

  const currentBalance = await getBalance({
    betterId: formattedId,
  });

  if (amount > currentBalance) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: `Saldo Insuficiente! Seu Saldo Atual: ${currentBalance}`,
    });
  }

  await deductBalance({
    amount: amount,
    betterId: formattedId,
  });

  const previousBalance = await getBalance({
    betterId: formattedId,
  });

  const matrix = spinReels();
  const textMatriz = printMatrix(matrix);
  const check_win = checkWin(matrix);
  let winnings = 0;

  if (check_win) {
    const addAmount = await betFactor({
      amount: amount,
      factor: check_win,
    });

    winnings = addAmount;
    await addBalance({
      betterId: betterId,
      amount: addAmount,
    });
  }

  await genericSendMessageOrchestrator({
    type: "text",
    msg: `*Fortune Bot [ID: ${Math.floor(
      100000 + Math.random() * 900000
    )}]*\n\n${textMatriz}\n${
      check_win
        ? `\n🎉🎉🎉 Parabéns! Você venceu! 🎉🎉🎉🎉`
        : `\nNão foi desta vez! Tente novamente. 🙁`
    }\n---- ---- ---- ----\nValor da Aposta: *R$ ${
      amount ? amount : "1,00"
    }*\nSeus Ganhos: *R$ ${winnings}*
    \nSaldo Anterior: *R$ ${previousBalance}*
    \nSaldo Atual: *R$ ${await getBalance({
      betterId: formattedId,
    })}*\nUsuário: ${formattedId}`,
  });
};

function spinReels() {
  const matrix = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    matrix.push(row);
  }

  return matrix;
}

const doesBetterExist = async (betterId) => {
  const rawData = fs.readFileSync(pathToFortuneBotJson, "utf8");
  let { betters_structure } = JSON.parse(rawData);

  return betters_structure.some((better) => better.betterId === betterId);
};

// Função para adicionar um novo better
const addBetter = async ({ betterId }) => {
  const rawData = fs.readFileSync(pathToFortuneBotJson, "utf8");
  let bettersJson = JSON.parse(rawData);

  bettersJson.betters_structure.push({
    betterId: betterId,
    balance: 100, // Defina um saldo inicial
  });

  fs.writeFileSync(pathToFortuneBotJson, JSON.stringify(bettersJson, null, 2));
};

const betFactor = async ({ amount, factor }) => {
  switch (factor) {
    case "🐅":
      return amount * 5;
    case "⭐":
      return amount * 2;
    case "💰":
      return amount * 1.25;

    case "🍀":
      return amount * 0.75;
    case "🔔":
      return amount * 0.5;
    case "🍒":
      return amount * 0.25;
  }
};

function checkWin(matrix) {
  // Verificar linhas
  for (let i = 0; i < 3; i++) {
    if (matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2]) {
      return matrix[i][0];
    }
  }

  // Verificar diagonais
  if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
    return matrix[0][0];
  }

  if (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) {
    return matrix[0][2];
  }

  return false;
}

function printMatrix(matrix) {
  const formattedIcons = matrix.map((row) => row.join(" | ")).join("\n");
  return formattedIcons;
}

const deductBalance = async ({ betterId, amount }) => {
  await checkFileExist();
  const formattedId = betterId.replace("@c.us", "");

  const rawData = fs.readFileSync(pathToFortuneBotJson, "utf8");
  let bettersJson = JSON.parse(rawData);

  const updateData = {
    betters_structure: bettersJson.betters_structure.map((better) => {
      if (better.betterId == formattedId) {
        return { ...better, balance: better.balance - amount }; // Incrementa balance
      }
      return better;
    }),
  };

  return fs.writeFileSync(
    pathToFortuneBotJson,
    JSON.stringify(updateData, null, 2)
  );
};

const addBalance = async ({ betterId, amount = 1 }) => {
  await checkFileExist();
  const formattedId = betterId.replace("@c.us", "");

  const rawData = fs.readFileSync(pathToFortuneBotJson, "utf8");
  let bettersJson = JSON.parse(rawData);

  const updateData = {
    betters_structure: bettersJson.betters_structure.map((better) => {
      if (better.betterId == formattedId) {
        return { ...better, balance: better.balance + amount }; // Incrementa balance
      }
      return better;
    }),
  };

  return fs.writeFileSync(
    pathToFortuneBotJson,
    JSON.stringify(updateData, null, 2)
  );
};

const getBalance = async ({ betterId }) => {
  await checkFileExist();
  const rawData = fs.readFileSync(pathToFortuneBotJson, "utf8");
  let { betters_structure } = JSON.parse(rawData);

  const batterbalance = betters_structure.filter((better) => {
    if (better.betterId == betterId) {
      return better;
    }
  });

  return batterbalance[0].balance;
};

module.exports = {
  fortuneBot,
};

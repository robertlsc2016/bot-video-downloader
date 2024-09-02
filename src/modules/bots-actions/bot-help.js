const {
  BOTCHATGPTISACTIVE,
  BOTSTATISTICSISACTIVE,
  BOTCOINFLIP,
  BOTISTRUE,
  BOTTEXTTOSPEECH,
  BOTTURNINSTICKER,
  BOTWHOIS,
} = require("../../settings/feature-enabler");
const { prefixBot } = require("../../settings/necessary-settings");
const { bot_actions } = require("../../utils/constants");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.bothelp = async function ({ from: from }) {
  await genericSendMessageOrchestrator({
    type: "text",
    msg: `Minhas funcionalidades atuais são:\n1. Posso baixar videos de Tiktok, Instagram, Facebook, Twitter e X(Ex-Twitter) basta enviar a URL do vídeo\n2. Posso jogar cara ou coroa, basta digita exatamente: *${prefixBot} cara ou coroa* [ Working: ${
      BOTCOINFLIP == "true" ? "Sim🟢" : "Não🔴"
    } ]\n3. Posso transformar imagem em sticker, basta mandar a imagem (ou link) com a descrição *${prefixBot} sticker* [ Working: ${
      BOTTURNINSTICKER == "true" ? "Sim🟢" : "Não🔴"
    } ] \n4. Posso marcar alguém aleatoriamente do grupo, basta digitar *${prefixBot} quem é* ... [ Working: ${
      BOTWHOIS == "true" ? "Sim🟢" : "Não🔴"
    } ] \n5. Posso dizer se algo é verdade ou não, basta digitar *${prefixBot} é verdade* ... ? [ Working: ${
      BOTISTRUE == "true" ? "Sim🟢" : "Não🔴"
    } ]\n6. Posso converter uma mensagem grande em áudio. Ela precisa ter mais de 250 caracteres [ Working: ${
      BOTTEXTTOSPEECH == "true" ? "Sim🟢" : "Não🔴"
    } ]\n7. Eu também sou uma inteligência Artifical, basta digitar *${
      bot_actions.pre_questions_chatgpt_bot
    }* || Caso seja um questionamento sério, use o comando *${prefixBot} ??* [ Working: ${
      BOTCHATGPTISACTIVE == "true" ? "Sim🟢" : "Não🔴"
    } ]\n8. Forneço as estatísticas do número de interações de cada participante do grupo, basta digitar *${prefixBot} estatisticas*\n9. Baixo fotos do instagram também, basta enviar o link da foto no grupo`,
  });
};

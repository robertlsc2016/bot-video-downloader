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
const { checkActions } = require("../../utils/check-actions");
const { bot_actions } = require("../../utils/constants");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.bothelp = async function ({ from: from }) {
  monitorUsageActions({
    action: "bot_help",
  });
  return await genericSendMessageOrchestrator({
    type: "text",
    msg: `Minhas funcionalidades atuais são:\n1. Posso baixar videos de Tiktok, Instagram, Facebook, Pintrest e ~X(Ex-Twitter)~ basta enviar a URL do vídeo\n2. Posso jogar cara ou coroa, basta digita exatamente: *${prefixBot} cara ou coroa* [ Working: ${
      BOTCOINFLIP == "true" ? "Sim🟢" : "Não🔴"
    } ]\n3. Posso transformar imagem em sticker, basta mandar a imagem/link/responder imagem com a descrição *${prefixBot} sticker* [ Working: ${
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
    } ]\n8. Forneço as estatísticas do número de interações de cada participante do grupo, basta digitar *${prefixBot} estatisticas* [ Working: ${
      BOTSTATISTICSISACTIVE == "true" ? "Sim🟢" : "Não🔴"
    } ]\n9. Baixo fotos do instagram/Pintrest/~twitter~/Facebook também, basta enviar o link da foto no grupo\n10. Baixo apenas o áudio de vídeos do youtube, basta enviar *${prefixBot} extract audio [link]\n11. Posso mencionar todos do grupo, basta digitar *@todos* [sua mensagem]\n12. Faço "Quem é esse pokemon?" basta mandar ${prefixBot} quem é esse pokemon?\n13. Posso medir a velocidade da minha conexão, basta digitar *${prefixBot} speedtest* [ Working: ${
      (await checkActions({
        typeAction: "bot_speedtest",
      }))
        ? "Sim🟢"
        : "Não🔴"
    } ]\n14. Posso mostrar os usos de cada função minha minha, basta digitar: *${prefixBot} usage monitor*`,
  });
};

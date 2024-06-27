const { prefixBot } = require("../../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.bothelp = async function ({ from: from }) {
  await genericSendMessageOrchestrator({
    type: "text",
    msg: `Minhas funcionalidades atuais são:\n1. Posso baixar videos de Tiktok, Instagram, Facebook, Twitter e X(Ex-Twitter) basta enviar a URL do vídeo\n2. Posso jogar cara ou coroa, basta digita exatamente: *${prefixBot} cara ou coroa*\n3. Posso transformar imagem em sticker, basta mandar a imagem com a descrição *${prefixBot} sticker*\n4. Posso marcar alguém aleatoriamente do grupo, basta digitar *${prefixBot} quem é* ... \n5. Posso dizer se algo é verdade ou não, basta digitar *${prefixBot} é verdade* ... ?`,
  });
};

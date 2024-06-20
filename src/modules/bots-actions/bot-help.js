const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.bothelp = async function ({ from: from }) {
  await genericSendMessageOrchestrator({
    from: from,
    type: "text",
    msg: "Minhas funções atuais são:\n1. Posso baixar videos de Tiktok, Instagram, Facebook, Twitter e X(Ex-Twitter) basta enviar a URL do vídeo\n2. Posso jogar cara ou coroa, basta digita exatamente: '/bot cara ou coroa' (sem as aspas, obviamente)\n3. Posso transformar imagem em sticker, basta manda a imagem com a descrição '/bot sticker'",
  });
};

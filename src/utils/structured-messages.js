const { prefixBot } = require("../settings/necessary-settings");

const structuredMessages = {
  readyMessage: `to online, galera 🤖!\nUse *${prefixBot} help* para ver minhas funcionalidades`,
  failureDownloadMessage:
    "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :(",
  technicalLimitationsMessage:
    "Por limitações tecnicas, só conseguirei mandar o vídeo no formato documento",
  attemptToDownloadMessage: "Tentarei baixar esse vídeo, um momento",
  successDownloadMessage: "Olha seu vídeo ai!",
  YTVideoDurationExceededMessage:
    process.env.videoTimeExceeded ||
    "A duração desse vídeo é maior que 5 minutos, o meu máximo é de vídeo até 5 minutos",
  incompatibleFormat:
    "Por aqui tudo certo, mas o vídeo não tem formato compatível com mp4",
};

module.exports = {
  structuredMessages,
};

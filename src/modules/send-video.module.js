const { runClient } = require("../config/config");
const { MessageMedia } = require("../dependencies");
const { localVariable } = require("../utils/constants");
const client = runClient();

const sendVideo = async (message, filePath, isDocument) => {
  // console.log("man, vou tentar fazer o envio agora");
  const media = MessageMedia.fromFilePath(`.\\videos\\${filePath}`);

  try {
    client.sendMessage(localVariable || message.from, media, {
      caption: isDocument
        ? "cara... seguinte, por limitações tecnicas só da mandar o video assim, contente-se"
        : "vou tentar baixar esse video ai, lgbt",
      sendMediaAsDocument: isDocument,
    });
    // console.log("deu certo todo o fluxo");
  } catch (err) {
    client.sendMessage(
      localVariable || message.from,
      "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
    );
    // console.log("falhou, faz o L: ", err);
  }
};

module.exports = { sendVideo };

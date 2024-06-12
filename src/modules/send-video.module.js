const { runClient } = require("../config/config");
const { MessageMedia } = require("../dependencies");
const { localVariable } = require("../utils/constants");
const client = runClient();

const sendVideo = async (message, filePath, isDocument) => {
  const media = MessageMedia.fromFilePath(`.\\videos\\${filePath}`);

  try {
    client.sendMessage(localVariable || message.from, media, {
      caption: isDocument
        ? "cara... seguinte, por limitações tecnicas só da mandar o video assim, contente-se"
        : "vou tentar baixar esse video ai, lgbt",
      sendMediaAsDocument: isDocument,
    });
  } catch (err) {
    client.sendMessage(
      localVariable || message.from,
      "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
    );
    console.log(err);
  }
};

module.exports = { sendVideo };

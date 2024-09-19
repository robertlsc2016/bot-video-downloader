const gTTS = require("gtts");
const fs = require("fs");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { structuredMessages } = require("../../utils/structured-messages");
const { pathTo } = require("../../utils/path-orchestrator");
const logger = require("../../logger");

module.exports.textToSpeech = async function ({ msg: msg }) {
  const audioPath = pathTo.medias.audiosPathFolder;

  const speech = msg;
  const gtts = new gTTS(speech, "pt-br");

  gtts.save(audioPath, async (err) => {
    if (err) {
      await genericSendMessageOrchestrator({
        type: "text",
        msg: structuredMessages.mgsErrorTextToAudio,
      });

      await deletarArquivo(audioPath);
    }

    await genericSendMessageOrchestrator({
      type: "media",
      filePath: audioPath,
    });
    await deletarArquivo(audioPath);
  });
};

async function deletarArquivo(audioPath) {
  if (fs.existsSync(audioPath)) {
    fs.unlink(audioPath, (err) => {
      if (err) {
        logger.error("Erro ao deletar o arquivo:", err);
      } else {
        logger.info("Arquivo deletado com sucesso");
      }
    });
  }
}

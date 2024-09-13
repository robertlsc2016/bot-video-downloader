const gTTS = require("gtts");
const fs = require("fs");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { structuredMessages } = require("../../utils/structured-messages");
const { pathTo } = require("../../utils/path-orchestrator");

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
        console.error("Erro ao deletar o arquivo:", err);
      } else {
        console.log("Arquivo deletado com sucesso");
      }
    });
  }
}

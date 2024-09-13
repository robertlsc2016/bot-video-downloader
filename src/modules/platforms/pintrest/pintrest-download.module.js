const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");

const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");
const logger = require("../../../logger");
const { getPintrestURL } = require("./pintrest-getURL.module");
const { pathTo } = require("../../../utils/path-orchestrator");

const filePathPhoto = pathTo.medias.images.pintrest

module.exports.downloadPintrest = async function ({ url }) {
  const urlPhoto = await getPintrestURL({ url });
  return await downloadVideoOrPhoto({
    url: urlPhoto,
    filePath: filePathPhoto,
  }).then(() => {
    sendMedia();
  });
};

const sendMedia = async () => {
  return await genericSendMessageOrchestrator({
    type: "media",
    filePath: filePathPhoto,
  });
};

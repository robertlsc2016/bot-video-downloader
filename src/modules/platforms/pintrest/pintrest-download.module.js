const axios = require("axios");
const path = require("path");

const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");
const {
  platformsNameDownload,
  imagesFolderPath,
} = require("../../../utils/constants");
const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");
const logger = require("../../../logger");
const { getPintrestURL } = require("./pintrest-getURL.module");

const filePathPhoto = path.join(
  imagesFolderPath,
  platformsNameDownload.pinterestPhoto
);

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

const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");

const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");
const logger = require("../../../logger");
const { getPintrestURL } = require("./pintrest-getURL.module");
const { pathTo } = require("../../../utils/path-orchestrator");

const filePathPhoto = pathTo.medias.images.pintrest;
const filePathVideo = pathTo.medias.videos.bruteCodecsFolder.pintrest;

module.exports.downloadPintrest = async function ({ url }) {
  const exctratURL = await getPintrestURL({ rawURL: url });
  const path = exctratURL?.includes(".mp4") ? filePathVideo : filePathPhoto;

  return await downloadVideoOrPhoto({
    url: exctratURL,
    filePath: path,
  }).then(() => {
    sendMedia({ path });
  });
};

const sendMedia = async ({ path }) => {
  return await genericSendMessageOrchestrator({
    type: "media",
    filePath: path,
  });
};

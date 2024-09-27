const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");

const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");
const { getPintrestURL } = require("./pintrest-getURL.module");
const { pathTo } = require("../../../utils/path-orchestrator");
const {
  convertVideoToAudio,
} = require("../../../utils/convert-video-to-audio");

const filePathPhoto = pathTo.medias.images.pintrest;
const filePathVideo = pathTo.medias.videos.bruteCodecsFolder.pintrest;
const outputAudioFilePath = pathTo.medias.audios.audio;

module.exports.downloadPintrest = async function ({ url, mode }) {
  const exctratURL = await getPintrestURL({ rawURL: url });
  const path = exctratURL?.includes(".mp4") ? filePathVideo : filePathPhoto;

  await downloadVideoOrPhoto({
    url: exctratURL,
    filePath: path,
  });

  if (mode == "extractAudio") {
    await convertVideoToAudio({ path: filePathVideo });
    return await genericSendMessageOrchestrator({
      filePath: outputAudioFilePath,
      type: "media",
      isDocument: false,
    });
  }

  sendMedia({ path });
};

const sendMedia = async ({ path }) => {
  return await genericSendMessageOrchestrator({
    type: "media",
    filePath: path,
  });
};

const axios = require("axios");
const logger = require("../../../logger");
const { downloadInstagram } = require("./instagram-download.module");
const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");
const { pathTo } = require("../../../utils/path-orchestrator");
const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");

const filePath = pathTo.medias.videos.bruteCodecsFolder.instagram;
const filePathPhoto = pathTo.medias.images.instagram;

module.exports.downloadInstagramStory = async function ({ msg: message }) {
  const username = message.split("/")[1].replace("@", "");
  const story_number = Number(message.split("/")[2]);

  if (isNaN(story_number)) {
    const message = "número de story inválido";
    await genericSendMessageOrchestrator({
      type: "text",
      msg: message,
    });
    return logger.warn(message);
  }

  const { data: instaInfos } = await axios.get(
    `https://gram-story-viewer.com/_next/data/aXx9ESbwK7IltezIKI9Oy/stories/${username}.json?username=${username}`
  );

  const { userInfo, initialmasonryfeed } = instaInfos.pageProps;

  if (!userInfo) {
    const message = "usuário não encontrado no instagram";
    await genericSendMessageOrchestrator({
      type: "text",
      msg: message,
    });
    return logger.warn(message);
  }

  if (userInfo.is_private) {
    const message = "esse perfil é privado";
    await genericSendMessageOrchestrator({
      type: "text",
      msg: message,
    });
    return logger.warn(message);
  }

  if (!initialmasonryfeed) {
    const message = "esse perfil não tem stories postado";
    await genericSendMessageOrchestrator({
      type: "text",
      msg: message,
    });
    return logger.warn(message);
  }

  if (story_number < 1 || story_number > initialmasonryfeed.length) {
    const message = `número de story inválido ou maior que o número de stories dispoíveis\nNúmeros de stories do perfil: ${initialmasonryfeed.length}`;
    await genericSendMessageOrchestrator({
      type: "text",
      msg: message,
    });
    return logger.warn(message);
  }

  await genericSendMessageOrchestrator({
    type: "text",
    msg: "Buscando seu story...",
  });

  const path =
    initialmasonryfeed[story_number - 1].media[0].type == "video"
      ? filePath
      : filePathPhoto;

  const url =
    initialmasonryfeed[story_number - 1].media[0].type == "video"
      ? initialmasonryfeed[story_number - 1].media[0].video
      : initialmasonryfeed[story_number - 1].media[0].thumbnail;

  await downloadVideoOrPhoto({
    url: url,
    filePath: path,
  });

  return await sendMedia({ filepath: path });
};

const sendMedia = async ({ filepath }) => {
  return await genericSendMessageOrchestrator({
    filePath: filepath,
    type: "media",
    isDocument: false,
  });
};

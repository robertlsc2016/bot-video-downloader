const { genericSendMessageOrchestrator } = require("../modules/generic-sendMessage-orchestrator.module");
const {
  downloadVDFacebook,
} = require("../modules/platforms/facebook/facebook-download.module");
const {
  downloadInstagram,
} = require("../modules/platforms/instagram/instagram-download.module");
const {
  downloadPintrest,
} = require("../modules/platforms/pintrest/pintrest-download.module");
const {
  downloadVDTiktok,
} = require("../modules/platforms/tiktok/tiktok-download.module");
const {
  downloadVDTwitter,
} = require("../modules/platforms/twitter-download.module");
const {
  downloadVDYoutube,
} = require("../modules/platforms/youtube-download.module");
const { platformsNameURL } = require("./constants");

const platformActions = {
  [platformsNameURL.tiktok]: downloadVDTiktok,
  [platformsNameURL.instagram]: downloadInstagram,
  [platformsNameURL.facebook]: downloadVDFacebook,
  [platformsNameURL.youtube]: downloadVDYoutube,
  [platformsNameURL.pinterest]: downloadPintrest,
  [platformsNameURL.x]: downloadVDTwitter,
};

const executeDownload = async ({ url, mode, send, type, platformKey }) => {
  const action = platformActions[platformKey];
  if (action) {
    await sendMessageAttemptToDownload();
    return await action({ url, mode, send, type });
  }
};

const sendMessageAttemptToDownload = async () => {
  await genericSendMessageOrchestrator({
    type: "text",
    situation: "attemptToDownload",
  });
};

module.exports = {
  executeDownload,
};

const { downloadVDFacebook } = require("./platforms/facebook-download.module");
const { downloadVDTwitter } = require("./platforms/twitter-download.module");
const { downloadVDYoutube } = require("./platforms/youtube-download.module");

const qrcode = require("qrcode-terminal");

const { client } = require("../settings/settings");

const {
  attemptToDownload,
  bot_actions,
  platformsNameURL,
} = require("../utils/constants");

const {
  stringToGroup,
  prefixBot,
  activeStatistics,
} = require("../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("./generic-sendMessage-orchestrator.module");
const {
  downloadVDInstagram,
  downloadInstagram,
} = require("./platforms/instagram-download.module");
const { downloadVDTiktok } = require("./platforms/tiktok-download.module");
const { headsOrTails } = require("./bots-actions/coin_flip");
const { bothelp } = require("./bots-actions/bot-help");
const { turnInSticker } = require("./bots-actions/turn-in-sticker");
const { whoIs } = require("./bots-actions/who-is");
const { structuredMessages } = require("../utils/structured-messages");
const { IsTrue } = require("./bots-actions/is-true");
const { textToSpeech } = require("./bots-actions/text-to-speech");
const { botChatGpt } = require("./bots-actions/bot-chatgpt");
const {
  botStatitics,
  showStatistics,
} = require("./bots-actions/bot-statistics");
const {
  BOTWHOIS,
  BOTISTRUE,
  BOTTURNINSTICKER,
  BOTSTATISTICSISACTIVE,
  BOTCOINFLIP,
  BOTTEXTTOSPEECH,
  BOTCHATGPTISACTIVE,
  ADMINSBOT,
} = require("../settings/feature-enabler");
const { rootBotActions } = require("./bots-actions/root-bot-actions");
const { checkActions } = require("../utils/check-actions");

module.exports.runMessageOrchestrator = function () {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
    await client.sendMessage(stringToGroup, structuredMessages.readyMessage);
  });

  client.on("message_create", async (message) => {
    if (message._data.id.fromMe && message.to == stringToGroup) {
      await messageSteps({ from: stringToGroup, message: message });
    }
  });
  client.on("message", async (message) => {
    await messageSteps({ from: message.from, message: message });
  });

  const messageSteps = async ({ from: from, message: message }) => {
    const messageBody = message.body;

    if (
      messageBody.includes(`${prefixBot} turn off`) &&
      ADMINSBOT.includes(message._data.author)
    ) {
      rootBotActions({ action: "turnoff" });
    }

    if (
      messageBody.includes(`${prefixBot} turn on`) &&
      ADMINSBOT.includes(message._data.author)
    ) {
      rootBotActions({ action: "turnon" });
    }

    if (
      messageBody.includes(prefixBot) &&
      !(await checkActions({ typeAction: "bot_active" }))
    ) {
      return await client.sendMessage(stringToGroup, "🤖💤💤💤...");
    }

    if (await checkActions({ typeAction: "bot_active" })) {
      try {
        if (from !== stringToGroup) {
          throw new Error(
            `o envio não foi configurado para esse destinatário: ${message._data.id}`
          );
        }

        let url = null;

        if (message?.links[0]?.link) {
          url = message.links[0].link;
        }

        if (
          !(
            (message._data.id.fromMe &&
              messageBody?.includes("funcionalidades")) ||
            messageBody?.includes("[Bot]")
          )
        ) {
          if (
            BOTTURNINSTICKER == "true" &&
            message?._data?.type == "image" &&
            message?._data?.caption?.includes(bot_actions.bot_sticker)
          ) {
            turnInSticker({ message: message });
          }

          if (
            (BOTCHATGPTISACTIVE == "true" || BOTCHATGPTISACTIVE) &&
            messageBody.includes(bot_actions.pre_questions_chatgpt_bot_really)
          ) {
            return await botChatGpt({ msg: messageBody, seriousness: "high" });
          }

          if (
            BOTCHATGPTISACTIVE == "true" &&
            messageBody.includes(bot_actions.pre_questions_chatgpt_bot)
          ) {
            return await botChatGpt({ msg: messageBody, seriousness: "low" });
          }

          if (
            (BOTWHOIS == "true" || BOTWHOIS) &&
            messageBody?.includes(bot_actions.who_is)
          ) {
            whoIs();
          }

          if (
            BOTISTRUE == "true" &&
            messageBody?.includes(bot_actions.is_true)
          ) {
            IsTrue({ msg: messageBody });
          }

          if (message.type && activeStatistics) {
            if (message.type == "chat" && messageBody.length > 5) {
              botStatitics({ msg: message });
            }
            botStatitics({ msg: message });
          }

          if (
            BOTSTATISTICSISACTIVE == "true" &&
            messageBody?.includes(bot_actions.statistics)
          ) {
            showStatistics();
          }

          if (messageBody?.includes(bot_actions.bot_help)) {
            bothelp({ from: from });
          }

          if (
            BOTCOINFLIP == "true" &&
            messageBody?.includes(bot_actions.coin_flip_string)
          ) {
            headsOrTails({ from: from });
          }

          if (
            BOTTEXTTOSPEECH == "true" &&
            (message.type =
              "chat" && messageBody.length > 250 && !message._data.id.fromMe)
          ) {
            await genericSendMessageOrchestrator({
              type: "text",
              msg: structuredMessages.preMsgAttempTextToAudio,
            });
            await textToSpeech({ msg: messageBody });
          }
        }

        if (url) {
          if (url.includes(platformsNameURL.tiktok)) {
            await sendMessageAttemptToDownload();
            return await downloadVDTiktok({ url: url });
          }

          if (url.includes(platformsNameURL.instagram)) {
            await sendMessageAttemptToDownload();

            return await downloadInstagram({
              url: url,
              type: url.includes("/p/") ? "photo" : "video",
            });
          }

          if (url.includes(platformsNameURL.facebook)) {
            await sendMessageAttemptToDownload();
            return await downloadVDFacebook({ url: url });
          }

          if (url.includes(platformsNameURL.x)) {
            await sendMessageAttemptToDownload();
            return await downloadVDTwitter({ url: url });
          }

          if (
            platformsNameURL.youtube.filter((yt) => url.includes(yt)).length > 0
          ) {
            await sendMessageAttemptToDownload();
            return await downloadVDYoutube({ url: url });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const sendMessageAttemptToDownload = async () => {
    await genericSendMessageOrchestrator({
      type: "text",
      situation: "attemptToDownload",
    });
  };
};

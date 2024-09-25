const {
  downloadVDFacebook,
} = require("./platforms/facebook/facebook-download.module");
const { downloadVDTwitter } = require("./platforms/twitter-download.module");
const { downloadVDYoutube } = require("./platforms/youtube-download.module");

const qrcode = require("qrcode-terminal");

const { client } = require("../settings/settings");

const { bot_actions, platformsNameURL } = require("../utils/constants");

const {
  stringToGroup,
  prefixBot,
  activeStatistics,
} = require("../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("./generic-sendMessage-orchestrator.module");
const {
  downloadInstagram,
} = require("./platforms/instagram/instagram-download.module");
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
  showStatistics,
  addParticipation,
  resetStatistics,
} = require("./bots-actions/bot-statistics");
const {
  BOTSTATISTICSISACTIVE,
  BOTCOINFLIP,
  BOTTEXTTOSPEECH,
  ADMINSBOT,
} = require("../settings/feature-enabler");
const { rootBotActions } = require("./bots-actions/root-bot-actions");
const { checkActions } = require("../utils/check-actions");

const logger = require("../logger");
const { mentionAll } = require("./bots-actions/mention-all");
const {
  whoIsThisPokemon,
  alreadyPokemon,
  pokemonSolved,
} = require("./bots-actions/who-is-that-pokemon");
const store = require("../redux/store");

const {
  downloadPintrest,
} = require("./platforms/pintrest/pintrest-download.module");
const { messageFilterValidator } = require("./message-filter-validator.module");
const { speedTest } = require("./bots-actions/speed-test");

module.exports.runMessageOrchestrator = function () {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    logger.log(qr);
  });

  client.on("ready", async () => {
    logger.info("Client is ready!");
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
      await messageFilterValidator({
        typeAction: "turnOff",
        params: { messageBody, message, ADMINSBOT },
      })
    ) {
      return await rootBotActions({ action: "turnoff" });
    }

    if (
      await messageFilterValidator({
        typeAction: "turnOn",
        params: { messageBody, message, ADMINSBOT },
      })
    ) {
      return await rootBotActions({ action: "turnon" });
    }

    if (
      await messageFilterValidator({
        typeAction: "botIsOff",
        params: { messageBody, message },
      })
    ) {
      return await client.sendMessage(stringToGroup, "🤖💤💤💤...");
    }

    if (await checkActions({ typeAction: "bot_active" })) {
      try {
        if (from !== stringToGroup) {
          logger.warn(`o envio não foi configurado para esse destinatário`);
          return;
        }

        let url = null;

        if (message?.links[0]?.link) {
          url = message.links[0].link;
        }

        if (
          await messageFilterValidator({
            typeAction: "ignoreMessageBot",
            params: { messageBody },
          })
        ) {
          if (
            await messageFilterValidator({
              typeAction: "turnoffSpeedTest",
              params: { messageBody },
            })
          ) {
            return await rootBotActions({ action: "turnoff_bot_speedtest" });
          }

          if (
            await messageFilterValidator({
              typeAction: "turnonSpeedTest",
              params: { messageBody },
            })
          ) {
            return await rootBotActions({ action: "turnon_bot_speedtest" });
          }

          if (
            await messageFilterValidator({
              typeAction: "pokemonIsSolved",
              params: { messageBody },
            })
          ) {
            return await pokemonSolved();
          }

          if (
            await messageFilterValidator({
              typeAction: "whoIsThatPokemon",
              params: { messageBody },
            })
          ) {
            const { pokemon } = store.getState();

            switch (pokemon.status) {
              case "EMPTY":
                return await whoIsThisPokemon();
              case "STARTED":
                return await alreadyPokemon();
              case "COMPLETE":
                return await whoIsThisPokemon();
            }
          }

          if (
            await messageFilterValidator({
              typeAction: "speedtest",
              params: { messageBody },
            })
          ) {
            return await speedTest();
          }

          if (
            await messageFilterValidator({
              typeAction: "mentionAll",
              params: { messageBody },
            })
          ) {
            return await mentionAll({ message: messageBody });
          }
          if (
            await messageFilterValidator({
              typeAction: "turnInStickerImageOrAnswered",
              params: { message, messageBody },
            })
          ) {
            (await messageFilterValidator({
              typeAction: "imageAnswered",
              params: { message },
            }))
              ? turnInSticker({
                  message: message,
                  situation: "answered",
                })
              : turnInSticker({
                  message: message,
                  fromURL: url,
                  situation: "image",
                });
          }

          if (
            await messageFilterValidator({
              typeAction: "gptReally",
              params: { messageBody, message },
            })
          ) {
            if (
              message._data?.quotedMsg &&
              message._data?.quotedMsg.type == "chat"
            ) {
              return await botChatGpt({
                msg: messageBody,
                seriousness: "high",
                inResponseTo: message._data?.quotedMsg.body,
              });
            }

            return await botChatGpt({ msg: messageBody, seriousness: "high" });
          }

          if (
            await messageFilterValidator({
              typeAction: "gptFunny",
              params: { messageBody },
            })
          ) {
            if (
              message._data?.quotedMsg &&
              message._data?.quotedMsg?.type == "chat"
            ) {
              return await botChatGpt({
                msg: messageBody,
                seriousness: "low",
                inResponseTo: message._data?.quotedMsg.body.replace(
                  "[Bot]\n",
                  ""
                ),
              });
            }
            return await botChatGpt({ msg: messageBody, seriousness: "low" });
          }

          if (
            await messageFilterValidator({
              typeAction: "whoIs",
              params: { messageBody },
            })
          ) {
            return await whoIs();
          }

          if (
            await messageFilterValidator({
              typeAction: "isTrue",
              params: { messageBody },
            })
          ) {
            IsTrue({ msg: messageBody });
          }

          if (message.type && activeStatistics) {
            if (
              message.type == "chat" &&
              messageBody.length > 5 &&
              !messageBody?.includes("[Bot]")
            ) {
              await addParticipation({ message });
            } else {
              await addParticipation({ message });
            }
          }

          if (
            await messageFilterValidator({
              typeAction: "resetStatistics",
              params: { messageBody, ADMINSBOT, message },
            })
          ) {
            return await resetStatistics();
          }

          if (
            BOTSTATISTICSISACTIVE &&
            messageBody?.includes(bot_actions.statistics)
          ) {
            return await showStatistics();
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

        if (url && !messageBody.includes("[Bot]")) {
          const makeASticker = messageBody.includes(bot_actions.bot_sticker);

          if (url.includes(platformsNameURL.tiktok)) {
            if (makeASticker)
              return turnInSticker({
                platform: "tiktok",
                url,
                situation: "url",
              });
            await sendMessageAttemptToDownload();
            return await downloadVDTiktok({ url: url });
          }

          if (url.includes(platformsNameURL.instagram)) {
            if (makeASticker)
              return turnInSticker({
                platform: "instagram",
                url,
                situation: "url",
              });
            await sendMessageAttemptToDownload();
            return await downloadInstagram({
              url: url,
              type: url.includes("/p/") ? "photo" : "video",
            });
          }

          if (url.includes(platformsNameURL.facebook)) {
            if (makeASticker)
              return turnInSticker({
                platform: "facebook",
                url,
                situation: "url",
              });
            await sendMessageAttemptToDownload();
            return await downloadVDFacebook({
              url: url,
              type:
                url.includes("/p/") || url.includes("/photo")
                  ? "photo"
                  : "video",
            });
          }

          if (url.includes(platformsNameURL.x)) {
            if (makeASticker)
              return turnInSticker({ platform: "x", url, situation: "url" });
            await sendMessageAttemptToDownload();
            return await downloadVDTwitter({ url: url });
          }

          if (
            platformsNameURL.pinterest.filter((pin) => url.includes(pin))
              .length > 0
          ) {
            if (makeASticker)
              return turnInSticker({
                platform: "pintrest",
                url,
                situation: "url",
              });
            await sendMessageAttemptToDownload();
            return await downloadPintrest({ url: url });
          }

          if (
            platformsNameURL.youtube.filter((yt) => url.includes(yt)).length > 0
          ) {
            await sendMessageAttemptToDownload();

            if (messageBody.includes(`${prefixBot} extract audio`)) {
              return await downloadVDYoutube({
                url: url,
                mode: "extractAudio",
              });
            }

            return await downloadVDYoutube({
              url: url,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
};

const sendMessageAttemptToDownload = async () => {
  await genericSendMessageOrchestrator({
    type: "text",
    situation: "attemptToDownload",
  });
};

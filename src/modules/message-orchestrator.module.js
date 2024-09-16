const {
  downloadVDFacebook,
} = require("./platforms/facebook/facebook-download.module");
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
const path = require("path");

const logger = require("../logger");
const { mentionAll } = require("./bots-actions/mention-all");
const { whoIsThisPokemon } = require("./bots-actions/who-is-that-pokemon");
const store = require("../redux/store");
const { sendPhotoPokemon } = require("../utils/pokemon/sendPhoto");
const {
  downloadPintrest,
} = require("./platforms/pintrest/pintrest-download.module");
const { messageFilterValidator } = require("./message-filter-validator.module");
const { pathTo } = require("../utils/path-orchestrator");

const rootPathPokemonFiles =
  pathTo.medias.images.pokemonsMedia.pokemonsMediaFolder;

const pathMergedPhotos = path.resolve(
  rootPathPokemonFiles,
  "merged_normal.png"
);

const pathMergedPhotosDarkened = path.resolve(
  rootPathPokemonFiles,
  "merged_darkened.png"
);

module.exports.runMessageOrchestrator = function () {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
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
              typeAction: "pokemonIsSolved",
              params: { messageBody },
            })
          ) {
            return await sendPhotoPokemon({
              situation: "SOLVED",
              path: pathMergedPhotos,
            });
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
                return await genericSendMessageOrchestrator({
                  type: "media",
                  textMedia: false,
                  filePath: pathMergedPhotosDarkened,
                  msg: "Já existe uma quest de pokemon iniciada! Tente acertar ;)",
                });
              case "COMPLETE":
                return await whoIsThisPokemon();
            }
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
              params: { messageBody },
            })
          ) {
            return await botChatGpt({ msg: messageBody, seriousness: "high" });
          }

          if (
            await messageFilterValidator({
              typeAction: "gptFunny",
              params: { messageBody },
            })
          ) {
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

        if (url && !messageBody.includes("[Bot]")) {
          const makeASticker = messageBody.includes(bot_actions.bot_sticker);

          if (url.includes(platformsNameURL.tiktok)) {
            if (makeASticker)
              return isTurnSticker({
                platform: "tiktok",
                url,
                situation: "url",
              });
            await sendMessageAttemptToDownload();
            return await downloadVDTiktok({ url: url });
          }

          if (url.includes(platformsNameURL.instagram)) {
            if (makeASticker)
              return isTurnSticker({
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
              return isTurnSticker({
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
              return isTurnSticker({ platform: "x", url, situation: "url" });
            await sendMessageAttemptToDownload();
            return await downloadVDTwitter({ url: url });
          }

          if (
            platformsNameURL.pinterest.filter((pin) => url.includes(pin))
              .length > 0
          ) {
            if (makeASticker)
              return isTurnSticker({
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

const isTurnSticker = ({ url, message, platform, situation }) => {
  return turnInSticker({ url: url, platform, situation });
};

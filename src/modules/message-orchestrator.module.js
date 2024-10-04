const logger = require("../logger");
const store = require("../redux/store");
const qrcode = require("qrcode-terminal");
const { client } = require("../settings/settings");

const { downloadVDTwitter } = require("./platforms/twitter-download.module");

const {
  stringToGroup,
  prefixBot,
  activeStatistics,
} = require("../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("./generic-sendMessage-orchestrator.module");

const {
  BOTSTATISTICSISACTIVE,
  BOTCOINFLIP,
  BOTTEXTTOSPEECH,
  ADMINSBOT,
} = require("../settings/feature-enabler");

const {
  bot_actions,
  platformsNameURL,
  checkActions,
  structuredMessages,
  startTimer,
  executeDownload,
} = require("../utils/util-unifier");

const {
  rootBotActions,
  speedTest,
  whoIsThisPokemon,
  alreadyPokemon,
  pokemonSolved,
  botApiNasa,
  headsOrTails,
  bothelp,
  turnInSticker,
  whoIs,
  IsTrue,
  textToSpeech,
  botChatGpt,
  showStatistics,
  addParticipation,
  resetStatistics,
  usageMonitor,
  mentionAll,
} = require("./bots-actions/bot-actions-unifier");
const { messageFilterValidator } = require("./message-filter-validator.module");
const { selectGroup } = require("../settings/select-group");

const runMessageOrchestrator = async () => {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    logger.log(qr);
  });

  client.on("ready", async () => {
    logger.info("Client is ready!");
    await selectGroup()

    await genericSendMessageOrchestrator({
      type: "text",
      msg: structuredMessages.readyMessage
    })
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
    startTimer();
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

        if (
          await messageFilterValidator({
            typeAction: "sky-image",
            params: { messageBody },
          })
        ) {
          return await botApiNasa({
            message: messageBody,
          });
        }

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
              typeAction: "usageMonitor",
              params: { messageBody },
            })
          ) {
            return await usageMonitor();
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
          let mode = "";
          const makeASticker = messageBody.includes(bot_actions.bot_sticker);

          if (url.includes(platformsNameURL.tiktok)) {
            if (makeASticker)
              return turnInSticker({
                platform: "tiktok",
                url,
                situation: "url",
              });

            if (messageBody.includes(`${prefixBot} extract audio`)) {
              mode = "extractAudio";
            }

            return await executeDownload({
              url: url,
              mode: mode,
              platformKey: platformsNameURL.tiktok,
            });
          }

          if (url.includes(platformsNameURL.instagram)) {
            if (makeASticker) {
              return turnInSticker({
                platform: "instagram",
                url,
                situation: "url",
              });
            }

            if (messageBody?.includes(`${prefixBot} extract audio`)) {
              mode = "extractAudio";
            }

            return await executeDownload({
              url: url,
              mode: mode,
              platformKey: platformsNameURL.instagram,
            });
          }

          if (url.includes(platformsNameURL.facebook)) {
            if (makeASticker)
              return turnInSticker({
                platform: "facebook",
                url,
                situation: "url",
              });

            if (messageBody?.includes(`${prefixBot} extract audio`))
              mode = "extractAudio";

            return await executeDownload({
              url: url,
              mode: mode,
              type:
                url.includes("/p/") || url.includes("/photo")
                  ? "photo"
                  : "video",
              platformKey: platformsNameURL.facebook,
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

            if (messageBody?.includes(`${prefixBot} extract audio`)) {
              mode = "extractAudio";
            }

            return await executeDownload({
              url: url,
              mode: mode,
              platformKey: platformsNameURL.pinterest,
            });
          }

          if (
            platformsNameURL.youtube.filter((yt) => url.includes(yt)).length > 0
          ) {
            if (messageBody.includes(`${prefixBot} extract audio`)) {
              mode = "extractAudio";
            }

            return await executeDownload({
              url: url,
              mode: mode,
              platformKey: platformsNameURL.youtube,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
};

module.exports = {
  runMessageOrchestrator,
};

const { pathTo } = require("./path-orchestrator");
const fs = require("fs");
const logger = require("../logger");

const pathToUsageMonitorJson = pathTo.pathToMonitorJson;

const monitorUsageActions = async ({ action: action }) => {
  if (!fs.existsSync(pathToUsageMonitorJson)) createStructure();

  const monitorDataRaw = fs.readFileSync(pathToUsageMonitorJson, "utf8");
  let monitorDataJson = JSON.parse(monitorDataRaw);

  switch (action) {
    case "bot_help":
      monitorDataJson.bot_help += 1;
      break;

    case "bot_chatgpt":
      monitorDataJson.bot_chatgpt += 1;
      break;

    case "bot_statistics":
      monitorDataJson.bot_statistics += 1;
      break;
    case "coin_flip":
      monitorDataJson.coin_flip += 1;
      break;

    case "is_true":
      monitorDataJson.is_true += 1;
      break;

    case "mention_all":
      monitorDataJson.mention_all += 1;
      break;

    case "speed_test":
      monitorDataJson.speed_test += 1;
      break;

    case "turn_in_sticker":
      monitorDataJson.turn_in_sticker += 1;
      break;

    case "who_is_that_pokemon":
      monitorDataJson.who_is_that_pokemon += 1;
      break;

    case "who_is":
      monitorDataJson.who_is += 1;
      break;

    case "facebook_download_video":
      monitorDataJson.bot_video_downloader.facebook += 1;
      break;

    case "facebook_download_photo":
      monitorDataJson.photos_downloader.facebook += 1;
      break;

    case "instagram_download_video":
      monitorDataJson.bot_video_downloader.instagram += 1;
      break;

    case "instagram_download_photo":
      monitorDataJson.photos_downloader.instagram += 1;
      break;

    case "tiktok_download_video":
      monitorDataJson.bot_video_downloader.tiktok += 1;
      break;

    case "tiktok_download_photo":
      monitorDataJson.photos_downloader.tiktok += 1;
      break;

    case "pintrest_download_video":
      monitorDataJson.bot_video_downloader.pintrest += 1;
      break;

    case "pintrest_download_photo":
      monitorDataJson.photos_downloader.pintrest += 1;
      break;

    case "youtube_download_video":
      monitorDataJson.bot_video_downloader.youtube += 1;
      break;
  }

  return updateJson(monitorDataJson);
};

const updateJson = (data) => {
  return fs.writeFileSync(
    pathToUsageMonitorJson,
    JSON.stringify(data, null, 2)
  );
};

const createStructure = async () => {
  const usageMonitor = JSON.stringify(initialStructure, null, 2);

  fs.writeFileSync(pathToUsageMonitorJson, usageMonitor, (err) => {
    if (err) {
      logger.error("Erro ao salvar o arquivo JSON:", err);
    } else {
      logger.info("Arquivo JSON salvo com sucesso!");
    }
  });
};

const initialStructure = {
  bot_help: 0,
  bot_chatgpt: 0,
  bot_statistics: 0,
  coin_flip: 0,
  is_true: 0,
  mention_all: 0,
  speed_test: 0,
  turn_in_sticker: 0,
  who_is_that_pokemon: 0,
  who_is: 0,
  bot_video_downloader: {
    facebook: 0,
    instagram: 0,
    tiktok: 0,
    pintrest: 0,
    youtube: 0,
  },
  photos_downloader: {
    facebook: 0,
    instagram: 0,
    tiktok: 0,
    pintrest: 0,
  },
};

module.exports = {
  monitorUsageActions,
  createStructure,
};

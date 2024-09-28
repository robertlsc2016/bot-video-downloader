const fs = require("fs");
const { pathTo } = require("../../utils/path-orchestrator");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { createStructure } = require("../../utils/monitor-usage-actions");

const pathToUsageMonitorJson = pathTo.pathToMonitorJson;

const usageMonitor = async () => {
  if (!fs.existsSync(pathToUsageMonitorJson)) createStructure();

  const monitorDataRaw = fs.readFileSync(pathToUsageMonitorJson, "utf8");
  let monitorDataJson = JSON.parse(monitorDataRaw);

  const message = `Monitor de Ações mais utilizadas:\n
  ➜ *Instagram*: *${monitorDataJson.bot_video_downloader.instagram}* vídeos & *${monitorDataJson.photos_downloader.instagram}* fotos
  ➜ *Tiktok*: *${monitorDataJson.bot_video_downloader.tiktok}* vídeos
  ➜ *Facebook*: *${monitorDataJson.bot_video_downloader.facebook}* vídeos & *${monitorDataJson.photos_downloader.facebook}* fotos
  ➜ *Pintrest*: *${monitorDataJson.bot_video_downloader.pintrest}* vídeos & *${monitorDataJson.photos_downloader.pintrest}* fotos
  ➜ *Youtube*: *${monitorDataJson.bot_video_downloader.pintrest}* vídeos
  
  ➜ Bot Help: *${monitorDataJson.bot_help}*
  ➜ Bot ChatGPT: *${monitorDataJson.bot_chatgpt}*
  ➜ Bot Estatísticas: *${monitorDataJson.bot_statistics}*
  ➜ Cara ou Coroa: *${monitorDataJson.coin_flip}*
  ➜ é Verdade?: *${monitorDataJson.is_true}*
  ➜ Mercionar Todos: *${monitorDataJson.mention_all}*
  ➜ Teste de Internet: *${monitorDataJson.speed_test}*
  ➜ Sticker: *${monitorDataJson.turn_in_sticker}*
  ➜ Quem é Esse Pokémon?: *${monitorDataJson.who_is_that_pokemon}*
  ➜ Quem é Esse?: *${monitorDataJson.who_is}*
  `;

  return await genericSendMessageOrchestrator({
    type: "text",
    msg: message,
  });
};

module.exports = {
  usageMonitor,
};

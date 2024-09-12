const path = require("path");
const axios = require("axios");
const cheerio = require('cheerio');
const logger = require("../../../logger");
const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");

module.exports.getPintrestURL = async ({ url }) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const urlPhoto = $("img").first().attr("src");

    if (urlPhoto?.length == 0 || urlPhoto === undefined) {
      throw new Error("não foi possível encontrar o conteúdo dessa url");
    }

    return urlPhoto;
  } catch (error) {
    logger.error(error);

    return await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
    });
  }
};

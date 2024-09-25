const axios = require("axios");
const cheerio = require("cheerio");
const got = require("got");
const logger = require("../../../logger");
const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");

module.exports.getPintrestURL = async ({ rawURL }) => {
  try {
    const URLMedia =
      (await getURLVideo({ rawURL })) ?? (await getURLImage({ rawURL }));
    return URLMedia;
  } catch (error) {
    logger.error(error);

    return await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
    });
  }
};

const getURLImage = async ({ rawURL }) => {
  const { data } = await axios.get(rawURL);
  const $ = cheerio.load(data);
  const urlPhoto = $("img").first().attr("src");

  if (urlPhoto?.length == 0 || urlPhoto === undefined) {
    throw new Error("não foi possível encontrar o conteúdo dessa url");
  }
  return urlPhoto;
};

const getURLVideo = async ({ rawURL }) => {
  const request = await got(rawURL);
  const resolver = request.body;
  const $ = cheerio.load(resolver);

  const data = $("body").find("script[data-test-id='video-snippet']").html();
  const jsonData = JSON.parse(data);

  return jsonData?.contentUrl;
};

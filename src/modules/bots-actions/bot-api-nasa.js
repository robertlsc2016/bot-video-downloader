const axios = require("axios");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { downloadVideoOrPhoto } = require("../../utils/downloadVideo");
const { pathTo } = require("../../utils/path-orchestrator");
const { translate } = require("@vitalets/google-translate-api");
const { downloadVDYoutube } = require("../platforms/youtube-download.module");
const logger = require("../../logger");

const regexDate = /(\d{2})\/(\d{2})\/(\d{4})|(\d{2})-(\d{2})-(\d{4})/g;

const botApiNasa = async ({ message }) => {
  if (!regexDate.test(message)) {
    return await genericSendMessageOrchestrator({
      msg: "essa mensagem NÃO possui uma data válida",
      type: "text",
    });
  }

  await genericSendMessageOrchestrator({
    type: "text",
    msg: "Buscando sua foto...",
  });

  let pathMediaNasa = null;

  const extractDate = message.match(regexDate);

  const [day, month, year] = extractDate[0].split("/");
  const formattedDate = `${year}-${month}-${day}`;

  const dateIsValid = await isDatePastOrEqual({
    date: formattedDate,
  });

  if (!dateIsValid)
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: "A data selecionada não pode ser maior que o dia de hoje! _Ou você está no futuro? Hehe!_",
    });

  const getInfosNasaAPI = await axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY_NASA}&date=${formattedDate}`
  );

  if (
    getInfosNasaAPI.data.media_type == "video" &&
    getInfosNasaAPI.data.url.includes("youtube")
  ) {
    await downloadVDYoutube({
      url: getInfosNasaAPI.data.url,
      send: false,
    });

    pathMediaNasa = pathTo.medias.videos.bruteCodecsFolder.youtube;
  }

  if (getInfosNasaAPI.data.media_type == "image") {
    pathMediaNasa = "image";
    await downloadVideoOrPhoto({
      url: getInfosNasaAPI.data.hdurl,
      filePath: pathTo.medias.images.nasa,
    });
    pathMediaNasa = pathTo.medias.images.nasa;
  }

  const text = await translateText({
    textToTranslation: getInfosNasaAPI.data.explanation,
  });

  return await sendMedia({
    pathMedia: pathMediaNasa,
    textMessage: text || getInfosNasaAPI.data.explanation,
  });
};

const sendMedia = async ({ pathMedia, textMessage }) => {
  return await genericSendMessageOrchestrator({
    filePath: pathMedia,
    type: "media",
    msg: `*Explicação*: ${textMessage}`,
    textMedia: false,
  });
};

const isDatePastOrEqual = async ({ date }) => {
  const dateNow = new Date();
  const dateInUse = new Date(date);
  const dateLimit = new Date("1995-06-16");

  if (dateNow < dateInUse) {
    return false;
  }

  if (dateInUse < dateLimit) {
    await genericSendMessageOrchestrator({
      type: "text",
      msg: "A data de consulta não pode ser menor que 16/06/1995. _Muito Antigo, não acha?!_",
    });
  }

  return true;
};

const translateText = async ({ textToTranslation }) => {
  try {
    const { text } = await translate(textToTranslation, {
      from: "en",
      to: "pt",
    });
    return text;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

module.exports = {
  botApiNasa,
};

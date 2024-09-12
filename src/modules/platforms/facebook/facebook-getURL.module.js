const getFbVideoInfo = require("fb-downloader-scrapper");
const logger = require("../../../logger");
const axios = require("axios");
const cheerio = require("cheerio");
const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");

const headers = {
  "sec-fetch-user": "?1",
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-site": "none",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "cache-control": "max-age=0",
  authority: "www.facebook.com",
  "upgrade-insecure-requests": "1",
  "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
  "sec-ch-ua":
    '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  cookie:
    "sb=Rn8BYQvCEb2fpMQZjsd6L382; datr=Rn8BYbyhXgw9RlOvmsosmVNT; c_user=100003164630629; _fbp=fb.1.1629876126997.444699739; wd=1920x939; spin=r.1004812505_b.trunk_t.1638730393_s.1_v.2_; xs=28%3A8ROnP0aeVF8XcQ%3A2%3A1627488145%3A-1%3A4916%3A%3AAcWIuSjPy2mlTPuZAeA2wWzHzEDuumXI89jH8a_QIV8; fr=0jQw7hcrFdas2ZeyT.AWVpRNl_4noCEs_hb8kaZahs-jA.BhrQqa.3E.AAA.0.0.BhrQqa.AWUu879ZtCw",
};

module.exports.getFacebookURL = async function ({ url: rawURL, type: type }) {
  try {
    if (type == "photo") {
      const urlFacebookPhoto = await getFacebookURLPhoto({ url: rawURL });
      return urlFacebookPhoto;
    }

    const facebookURL = await getFbVideoInfo(rawURL);

    const condition = facebookURL.url;

    if (condition) {
      return facebookURL;
    }

    if (condition == false) {
      throw new Error(
        "problema no retorno do link da api getFbVideoInfo. Talvez o link de entrada esteja incorreto ou inválido"
      );
    }
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const getFacebookURLPhoto = async ({ url }) => {
  let { data } = await axios.get(url, { headers });
  data = data.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

  const $ = cheerio.load(data);
  const linkTag = $('link[rel="preload"][as="image"]').filter((i, el) => {
    return (
      $(el).attr("href") && $(el).attr("href").includes("https://scontent.")
    );
  });

  const linkPhoto = linkTag.attr("href");

  if (linkPhoto?.length == 0 || linkPhoto === undefined) {
    throw new Error("não foi possível encontrar o conteúdo dessa url");
  }

  return linkPhoto;
};

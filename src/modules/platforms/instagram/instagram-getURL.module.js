const instagramGetUrl = require("instagram-url-direct");
const logger = require("../../../logger");

module.exports.getInstagramURL = async function ({ url: rawURL }) {
  try {
    const { results_number, url_list } = await instagramGetUrl(rawURL);

    if (results_number > 0) {
      return url_list[0];
    }
  } catch (error) {
    logger.error(
      "Problema no retorno do link da API getFbVideoInfo. Talvez o link de entrada esteja incorreto ou inválido."
    );
    return false;
  }
};

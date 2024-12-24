const instagramGetUrl = require("instagram-url-direct");

module.exports.getInstagramURL = async function ({ url: rawURL, index = 0 }) {
  try {
    const { results_number, url_list } = await instagramGetUrl(rawURL);

    if (index < 0) {
      throw new Error(`A posição do carrossel não pode ser menor que 1`);
    }

    if (index > results_number) {
      throw new Error(
        `Esse post possui ${url_list.length} posts no carrossel. Selecione o post nesse intervalo`
      );
    }

    return url_list[index];
  } catch (error) {
    if (error.status == 404) {
      throw new Error("Erro desconhecido ao baixar mídia");
    }
  }
};

const axios = require("axios");
const fs = require("fs");
const logger = require("../logger");

const downloadVideoOrPhoto = async function ({ url: url, filePath: filePath }) {
  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    return new Promise(async (resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      await response.data.pipe(writer);
      writer.on("finish", () => {
        logger.info(`arquivo salvo em: ${filePath}`);
        resolve();
      });
      writer.on("error", reject);
    });
  } catch (error) {
    logger.error(`Erro ao baixar o arquivo: ${error.message}`);
    throw error; // Lançar erro para ser tratado em outro lugar
  }
};

module.exports = {
  downloadVideoOrPhoto,
};

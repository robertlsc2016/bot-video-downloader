const axios = require("axios");
const fs = require("fs");
const logger = require("../logger");

const downloadVideoOrPhoto = async function ({ url: url, filePath: filePath }) {
  const response = await axios({
    method: "get",
    url: url,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on("finish", () => {
      logger.info(`arquivo salvo em: ${filePath}`);
      resolve();
    });
    writer.on("error", reject);
  });
};

module.exports = {
  downloadVideoOrPhoto,
};

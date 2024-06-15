const axios = require("axios");
const fs = require("fs");

module.exports.downloadVideo = async function (url, filePath) {
  console.log()
  const response = await axios({
    method: "get",
    url: url,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

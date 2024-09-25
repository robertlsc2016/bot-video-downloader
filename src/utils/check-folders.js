const fs = require("fs");
const { pathTo } = require("./path-orchestrator");
const logger = require("../logger");

module.exports.ensureDirectoryExists = async function () {
  const folderAjustedCodecs =
    pathTo.medias.videos.ajustedCodecsFolder.pathFolder;
  const folderBruteCodecs = pathTo.medias.videos.bruteCodecsFolder.pathFolder;
  const folderAudios = pathTo.medias.audios.pathFolder;
  const folderImages = pathTo.medias.images.imagesFolder;

  if (!fs.existsSync(folderImages)) {
    fs.mkdirSync(folderImages, { recursive: true });
    logger.info(`Directory created: ${folderImages}`);
  }

  if (!fs.existsSync(folderAudios)) {
    fs.mkdirSync(folderAudios, { recursive: true });
    logger.info(`Directory created: ${folderAudios}`);
  }

  if (!fs.existsSync(folderAjustedCodecs)) {
    fs.mkdirSync(folderAjustedCodecs, { recursive: true });
    logger.info(`Directory created: ${folderAjustedCodecs}`);
  }

  if (!fs.existsSync(folderBruteCodecs)) {
    fs.mkdirSync(folderBruteCodecs, { recursive: true });
    logger.info(`Directory created: ${folderBruteCodecs}`);
  }
};

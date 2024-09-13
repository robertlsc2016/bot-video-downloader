const fs = require("fs");
const { pathTo } = require("./path-orchestrator");

module.exports.ensureDirectoryExists = async function () {
  const folderAjustedCodecs = pathTo.medias.videos.ajustedCodecsFolder.pathFolder;
  const folderBruteCodecs = pathTo.medias.videos.bruteCodecsFolder.pathFolder;
  const folderAudios = pathTo.medias.audios.pathFolder;

  if (!fs.existsSync(folderAudios)) {
    fs.mkdirSync(folderAudios, { recursive: true });
    console.log(`Directory created: ${folderAudios}`);
  }

  if (!fs.existsSync(folderAjustedCodecs)) {
    fs.mkdirSync(folderAjustedCodecs, { recursive: true });
    console.log(`Directory created: ${folderAjustedCodecs}`);
  }

  if (!fs.existsSync(folderBruteCodecs)) {
    fs.mkdirSync(folderBruteCodecs, { recursive: true });
    console.log(`Directory created: ${folderBruteCodecs}`);
  }
};

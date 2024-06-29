const fs = require("fs");
const path = require("path");
const {
  videosFolderPathBruteCodecs,
  videosFolderPathAjustedCodecs,
  audiosPathFolder,
} = require("./constants");

module.exports.ensureDirectoryExists = async function () {
  const folderAjustedCodecs = videosFolderPathAjustedCodecs;
  const folderBruteCodecs = videosFolderPathBruteCodecs;
  const folderAudios = audiosPathFolder;

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

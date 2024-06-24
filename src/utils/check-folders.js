const fs = require("fs");
const path = require("path");
const {
  videosFolderPathBruteCodecs,
  videosFolderPathAjustedCodecs,
} = require("./constants");

module.exports.ensureDirectoryExists = async function () {
  const folderAjustedCodecs = videosFolderPathAjustedCodecs;
  const folderBruteCodecs = videosFolderPathBruteCodecs;

  if (!fs.existsSync(folderAjustedCodecs)) {
    fs.mkdirSync(folderAjustedCodecs, { recursive: true });
    console.log(`Directory created: ${folderAjustedCodecs}`);
  }

  if (!fs.existsSync(folderBruteCodecs)) {
    fs.mkdirSync(folderBruteCodecs, { recursive: true });
    console.log(`Directory created: ${folderBruteCodecs}`);
  }
};

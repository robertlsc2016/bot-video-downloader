const path = require("path");
const { platformsNameDownload } = require("./constants");

const rooPath = path.join(__dirname, "..", "..");

const pathTo = {
  pathToStatesJson: path.join(rooPath, "data", "states.json"),
  pathToStatisticJson: path.join(rooPath, "data", "statistics.json"),

  medias: {
    audios: {
      pathFolder: path.join(rooPath, "medias", "audios", "audios"),
      audio: path.join(rooPath, "medias", "audios", "audio.mp3"),
      youtube: path.join(
        rooPath,
        "medias",
        "audios",
        platformsNameDownload.youtubeAudio
      ),
    },
    videos: {
      bruteCodecsFolder: {
        pathFolder: path.join(rooPath, "medias", "videos", "brute-codecs"),
        tiktok: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.tiktok
        ),
        x: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.x
        ),
        youtube: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.youtube
        ),
        facebook: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.facebook
        ),

        instagram: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.instagram
        ),
      },
      ajustedCodecsFolder: {
        pathFolder: path.join(rooPath, "medias", "videos", "ajusted-codecs"),
        youtube: path.join(
          rooPath,
          "medias",
          "videos",
          "ajusted-codecs",
          platformsNameDownload.youtube
        ),
      },
    },
    images: {
      imagesFolder: path.join(rooPath, "medias", "images"),
      instagram: path.join(
        rooPath,
        "medias",
        "images",
        platformsNameDownload.instagramPhoto
      ),
      facebook: path.join(
        rooPath,
        "medias",
        "images",
        platformsNameDownload.facebookPhoto
      ),
      pintrest: path.join(
        rooPath,
        "medias",
        "images",
        platformsNameDownload.pinterestPhoto
      ),
    },
  },
};

module.exports = {
  pathTo,
};

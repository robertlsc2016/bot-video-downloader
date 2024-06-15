// const { client } = require("../settings/settings");
// const { MessageMedia } = require("whatsapp-web.js");

// const sendVideo = async (from, filePath, isDocument) => {
//   const media = MessageMedia.fromFilePath(`.\\videos\\x-video.mp4`);

//   try {
//     client.sendMessage(from, media, {
//       caption: isDocument
//         ? "cara... seguinte, por limitações tecnicas só da mandar o video assim, contente-se"
//         : "vou tentar baixar esse video ai, lgbt",
//       sendMediaAsDocument: isDocument,
//     });
//   } catch (err) {
//     client.sendMessage(
//       from,
//       "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
//     );
//   }
// };

// module.exports = { sendVideo };

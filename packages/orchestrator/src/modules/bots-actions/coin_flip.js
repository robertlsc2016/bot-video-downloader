const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

module.exports.headsOrTails = async function ({ from: from }) {
  const result = Math.random() < 0.5 ? "cara" : "coroa";

  ["o destino definiu", "...", result].map((value, index) => {
    setTimeout(async () => {
      await genericSendMessageOrchestrator({
        from: from,
        type: "text",
        msg: value,
      });
    }, 1000 * index);
  });
};

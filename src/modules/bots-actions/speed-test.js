const FastSpeedtest = require("fast-speedtest-api");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
require("dotenv").config();

const speedTest = async () => {
  let speedtest = new FastSpeedtest({
    token: process.env.TOKEN_FAST, // required
    verbose: false, // default: false
    timeout: 10000, // default: 5000
    https: true, // default: true
    urlCount: 5, // default: 5
    bufferSize: 8, // default: 8
    unit: FastSpeedtest.UNITS.Mbps, // default: Bps
  });

  const speed = await speedtest.getSpeed();
  await genericSendMessageOrchestrator({
    type: "text",
    msg: `Teste de Internet:\nMinha conexão é de: *${speed.toFixed(2)} Mbps*`,
  });
  return speed;
};

module.exports = {
  speedTest,
};

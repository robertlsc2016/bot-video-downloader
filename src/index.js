const { runClient } = require("./config/config");
const {
  runMessageOrchestrator,
} = require("./modules/message-orchestrator.module");

runClient();
runMessageOrchestrator()
const { initializeClient } = require("./settings/settings");
const {
  runMessageOrchestrator,
} = require("./modules/message-orchestrator.module");

initializeClient();
runMessageOrchestrator()
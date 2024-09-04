const { initializeClient } = require("./settings/settings");
const {
  runMessageOrchestrator,
} = require("./modules/message-orchestrator.module");
const { ensureDirectoryExists } = require("./utils/check-folders");
const logger = require('./logger');

ensureDirectoryExists()
initializeClient();
runMessageOrchestrator()
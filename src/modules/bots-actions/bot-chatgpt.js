const OpenAI = require("openai");
const {
  instructionChatGPT,
  prefixBot,
  openIaApiKey,
  instructionChatGPTSeriousness,
} = require("../../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const store = require("../../redux/store");
const {
  start_WhosThatPokemon,
  tip_WhosThatPokemon,
} = require("../../redux/actions/actions");
const logger = require("../../logger");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: openIaApiKey,
});

module.exports.botChatGpt = async ({
  msg: msg,
  seriousness: seriousness,
  toSend = true,
  pokemonTip = false,
  inResponseTo,
}) => {
  monitorUsageActions({
    action: "bot_chatgpt",
  });
  let instruction =
    seriousness == "high" ? instructionChatGPTSeriousness : instructionChatGPT;
  let clearMessage = msg
    ?.replace(`${prefixBot} ??`, "")
    .replace(`${prefixBot} ?`, "")
    .trim();

  inResponseTo
    ? (clearMessage += `\nEm reposta a mensagem: ${inResponseTo.replace(
        "[Bot]\n",
        ""
      )}`)
    : clearMessage;

  if (pokemonTip) {
    instruction = `forneca alguma informação curta sobre o pokemon ${msg} sem citar o nome dele usando pouquíssimas palavras`;
  }


  if (clearMessage.length == 0) {
    clearMessage = "oi";
  }

  const assistant = await openai.beta.assistants.create({
    name: "bot-video-downloader",
    instructions: instruction,
    model: "gpt-4o",
  });

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: clearMessage,
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
    instructions: instruction,
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const msgs = messages.data
      .reverse()
      .filter((msg) => msg.role == "assistant");
    const filterText = msgs[0].content[0].text.value;

    if (pokemonTip) {
      return store.dispatch(tip_WhosThatPokemon({ tip: filterText }));
    }

    if (toSend) {
      return await genericSendMessageOrchestrator({
        type: "text",
        msg: filterText,
      });
    }
  } else {
    logger.info(run.status);
  }
};

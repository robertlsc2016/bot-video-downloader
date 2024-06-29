const OpenAI = require("openai");
const {
  instructionChatGPT,
  prefixBot,
} = require("../../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports.botChatGpt = async ({ msg: msg }) => {
  const instruction = instructionChatGPT;
  const clearMessage = msg.replace(`${prefixBot} pergunta`, "");
  const assistant = await openai.beta.assistants.create({
    name: "bot-video-downloader",
    instructions: instruction,
    model: "gpt-3.5-turbo",
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

    await genericSendMessageOrchestrator({
      type: "text",
      msg: filterText,
    });
  } else {
    console.log(run.status);
  }
};

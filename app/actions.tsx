import { agentExecutor } from "@/ai/graph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { CoreMessage, generateId } from "ai";
import { createAI, getMutableAIState } from "ai/rsc";
import { ReactNode } from "react";
import { streamRunnableUI } from "./server";

interface InputProps {
  prompt: string;
  file?: {
    base64: string;
  };
}

const convertChatHistoryToMessage = (chat_history: CoreMessage[]) =>
  chat_history.map(({ role, content }) => {
    switch (role) {
      case "user":
        return new HumanMessage(content as string);
      case "assistant":
      case "system":
        return new AIMessage(content as string);
      default:
        throw new Error(`Unknown role: { role}`);
    }
  });

function processFile(input: InputProps, chat_history: CoreMessage[]) {
  if (input.file) {
    const imageTemplate = new HumanMessage({
      content: [
        {
          type: "image_url",
          image_url: {
            url: input.file.base64,
          },
        },
      ],
    });

    return {
      input: input.prompt,
      chat_history: [
        ...convertChatHistoryToMessage(chat_history),
        imageTemplate,
      ],
    };
  } else {
    return {
      input: input.prompt,
      chat_history: convertChatHistoryToMessage(chat_history),
    };
  }
}

async function sendMessage(input: InputProps) {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  const processInputs = processFile(input, messages.get() as CoreMessage[]);
  const streamUI = streamRunnableUI(agentExecutor(), processInputs);

  (async () => {
    let lastEvent = await streamUI.lastEvent;

    if (typeof lastEvent === "object") {
      if (lastEvent["invokeModel"]["result"]) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "user", content: input.prompt },
          { role: "assistant", content: lastEvent["invokeModel"]["result"] },
        ]);
      } else if (lastEvent["invokeTools"]) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "user", content: input.prompt },
          {
            role: "assistant",
            content: `Total result: ${JSON.stringify(lastEvent["invokeTools"]["toolResult"], null)}`,
          },
        ]);
      } else {
        console.log("else", lastEvent);
      }
    }
  })();

  if (input.file) {
    return {
      ui: streamUI.ui,
      url: input.file.base64,
    };
  }

  return { ui: streamUI.ui };
}

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database if needed
      console.log("----------- START ----------");
      console.log(JSON.stringify(state, null, 2));
      console.log("----------- END ----------");
    }
  },
});

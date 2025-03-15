import { BaseMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph, START, END } from "@langchain/langgraph";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import {
  chartTool,
  imageTool,
  searchTool,
  weatherTool,
  audioTool,
  youtubeTool,
  documentTool,
} from "./tools";

interface AgentExecutorStore {
  input: string;
  chat_history: BaseMessage[];
  result?: string;
  toolCall?: {
    name: string;
    parameters: Record<string, any>;
  };
  toolResult?: Record<string, any>;
}

const invokeModel = async (
  state: AgentExecutorStore,
  config?: RunnableConfig,
): Promise<Partial<AgentExecutorStore>> => {
  const initialPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant. You are provided a list of tools, and an input from the user.\n
             Your job is to determine whether or not you have a tool which can handle the users input,
             or respond with plain text.
            `,
    ],
    new MessagesPlaceholder({
      variableName: "chat_history",
      optional: true,
    }),
    ["human", "{input}"],
  ]);

  const tools = [
    chartTool,
    searchTool,
    weatherTool,
    imageTool,
    audioTool,
    youtubeTool,
    documentTool,
  ];

  const llm = new ChatOpenAI({
    temperature: 0,
    model: "gpt-4-turbo",
    streaming: true,
  }).bindTools(tools);

  const chain = initialPrompt.pipe(llm);

  const result = await chain.invoke(
    {
      input: state.input,
      chat_history: state.chat_history,
    },
    config,
  );

  if (result.tool_calls && result.tool_calls.length > 0) {
    return {
      toolCall: {
        name: result.tool_calls[0].name,
        parameters: result.tool_calls[0].args,
      },
    };
  }

  return {
    result: result.content as string,
  };
};

const invokeToolsOrReturn = (state: AgentExecutorStore) => {
  if (state.toolCall) {
    return "invokeTools";
  }
  if (state.result) {
    return END;
  }
  throw new Error("No tool call or result found");
};

const invokeTools = async (
  state: AgentExecutorStore,
  config?: RunnableConfig,
): Promise<Partial<AgentExecutorStore>> => {
  if (!state.toolCall) {
    throw new Error("No tool call found.");
  }

  const toolMap = {
    [chartTool.name]: chartTool,
    [searchTool.name]: searchTool,
    [weatherTool.name]: weatherTool,
    [imageTool.name]: imageTool,
    [audioTool.name]: audioTool,
    [youtubeTool.name]: youtubeTool,
    [documentTool.name]: documentTool,
  };

  const selectedTool = toolMap[state.toolCall.name];

  if (!selectedTool) {
    throw new Error("No tool found in tool map");
  }

  const toolResult = await selectedTool.invoke(
    state.toolCall.parameters as any,
    config,
  );

  return {
    toolResult: JSON.parse(toolResult),
  };
};

export function agentExecutor() {
  const workflow = new StateGraph<AgentExecutorStore>({
    channels: {
      input: null,
      chat_history: null,
      result: null,
      toolCall: null,
      toolResult: null,
    },
  })
    .addNode("invokeModel", invokeModel)
    .addNode("invokeTools", invokeTools)
    .addConditionalEdges("invokeModel", invokeToolsOrReturn)
    .addEdge(START, "invokeModel")
    .addEdge("invokeTools", END);

  const graph = workflow.compile();
  return graph;
}

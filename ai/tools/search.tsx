import { DynamicStructuredTool } from "@langchain/core/tools";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { RunnableConfig } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { AIMessageText } from "@/components/message";
import { SearchLoading } from "@/components/ui/search";

export const searchTool = new DynamicStructuredTool({
  name: "WebSearchTool",
  description: "Searches the web using Tavily API and returns the top result.",
  schema: z.object({
    input: z
      .string()
      .describe("The search query to find relevant information."),
  }),
  func: async ({ input }, _, config?: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <SearchLoading />,
          type: "append",
        },
      },
      config,
    );

    const tavilySearch = new TavilySearchResults({ maxResults: 1 });
    const result = await tavilySearch.invoke(input);

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <AIMessageText content={JSON.parse(result)[0].content} />,
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify(result, null);
  },
});

import { tool } from "@langchain/core/tools";
import { RunnableConfig } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { Document, DocumentLoading } from "@/components/ui/document";

const retriever = new TavilySearchAPIRetriever({
  k: 3,
});

const documentSchema = z.object({
  prompt: z.string().describe("Prompt to retrive documents with links"),
});

export const documentTool = tool(
  async (input, config: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <DocumentLoading />,
          type: "append",
        },
      },
      config,
    );

    const retrievedDocuments = await retriever.invoke(input.prompt);

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: (
            <Document {...JSON.parse(JSON.stringify(retrievedDocuments))} />
          ),
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify(retrievedDocuments, null);
  },
  {
    name: "DocumentGenerationTool",
    description: "Retrieve documents/links based on the given prompt",
    schema: documentSchema,
  },
);

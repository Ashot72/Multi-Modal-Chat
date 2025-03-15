import { tool } from "@langchain/core/tools";
import { RunnableConfig } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { DallEIamgeLoading, DalleImage } from "@/components/ui/image";
import { DallEAPIWrapper } from "@langchain/openai";

const imageSchema = z.object({
  prompt: z.string().describe("Prompt to generate an image"),
});

async function dalleData(input: z.infer<typeof imageSchema>) {
  const tool = new DallEAPIWrapper({
    n: 1,
    size: "512x512",
    model: "dall-e-2",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const imageURL = await tool.invoke(input.prompt);
  return imageURL;
}

export const imageTool = tool(
  async (input, config: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <DallEIamgeLoading />,
          type: "append",
        },
      },
      config,
    );

    const url = await dalleData(input);

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <DalleImage url={url} />,
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify({ url }, null);
  },
  {
    name: "ImageGenerationTool",
    description:
      "Generate an AI-generated image based on the provided text prompt, using DALL·E with customizable model version, image size, and quantity.",
    schema: imageSchema,
  },
);

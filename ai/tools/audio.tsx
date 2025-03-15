const gTTS = require("gtts");
const shortid = require("shortid");
import { tool } from "@langchain/core/tools";
import { RunnableConfig } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { Audio, AudioLoading } from "@/components/ui/audio";

const audioSchema = z.object({
  prompt: z.string().describe("Text to generate audio"),
});

async function audioFile(input: z.infer<typeof audioSchema>): Promise<string> {
  return new Promise((resolve, reject) => {
    const uniqueID = shortid.generate();
    const gtts = new gTTS(input.prompt, "en");

    gtts.save(`./public/${uniqueID}.mp3`, function (err: any) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(uniqueID);
      }
    });
  });
}

export const audioTool = tool(
  async (input, config: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <AudioLoading />,
          type: "append",
        },
      },
      config,
    );

    const audioId = await audioFile(input);

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <Audio id={audioId} />,
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify(input, null);
  },
  {
    name: "AudioGenerationTool",
    description: "Text content to convert into an audio file.",
    schema: audioSchema,
  },
);

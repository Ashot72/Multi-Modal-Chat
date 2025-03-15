import { tool } from "@langchain/core/tools";
import { RunnableConfig } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { Video, VideoLoading } from "@/components/ui/video";

interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: SearchResult[];
}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

interface SearchResult {
  kind: string;
  etag: string;
  id: VideoId;
}

interface VideoId {
  kind: string;
  videoId: string;
}

const videoSchema = z.object({
  prompt: z.string().describe("Youtube video based on the content"),
});

async function videoUrl(
  input: z.infer<typeof videoSchema>,
): Promise<YouTubeSearchResponse> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?q=${input.prompt}&maxResults=1&key=${process.env.YOUTUBE_DATA_API_KEY}`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("There was an error fetching the weather data.");
  }
}

export const youtubeTool = tool(
  async (input, config: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <VideoLoading />,
          type: "append",
        },
      },
      config,
    );

    const youtubeData = await videoUrl(input);

    let videoId = "";

    if (youtubeData && youtubeData.items.length > 0) {
      videoId = youtubeData.items[0].id.videoId;
    }

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <Video videoId={videoId} />,
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify({ videoId }, null);
  },
  {
    name: "YoutubeTool",
    description:
      "A tool to fetch the video/youtube video based on the content by directly searching Youtube.",
    schema: videoSchema,
  },
);

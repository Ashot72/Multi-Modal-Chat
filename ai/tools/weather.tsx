import { RunnableConfig } from "@langchain/core/runnables";
import { tool } from "@langchain/core/tools";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { Weather, WeatherLoading } from "@/components/ui/weather";

const weatherSchema = z.object({
  city: z.string().describe("The city name to get weather for"),
});

async function weatherData(input: z.infer<typeof weatherSchema>) {
  try {
    const response = await fetch(
      `https://freetestapi.com/api/v1/weathers?search=${input.city}`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("There was an error fetching the weather data.");
  }
}

export const weatherTool = tool(
  async (input, config: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <WeatherLoading />,
          type: "append",
        },
      },
      config,
    );

    const data = await weatherData(input);

    const weatherProps = data && data.length > 0 ? data[0] : undefined;

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <Weather {...weatherProps} />,
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify(data, null);
  },
  {
    name: "WeatherTool",
    description: `A tool to fetch the current weather, given a city.`,
    schema: weatherSchema,
  },
);

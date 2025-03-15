import "server-only";

import { isValidElement } from "react";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { Runnable } from "@langchain/core/runnables";
import { CompiledStateGraph } from "@langchain/langgraph";
import { StreamEvent } from "@langchain/core/tracers/log_stream";
import { AIMessage } from "@/components/ai-message";

export const dynamic = "force-dynamic";

export const CUSTOM_EVENT_NAME = "__custom_event__";

export function streamRunnableUI<RunInput, RunOutput>(
  runnable:
    | Runnable<RunInput, RunOutput>
    | CompiledStateGraph<RunInput, Partial<RunOutput>>,
  inputs: RunInput,
) {
  const ui = createStreamableUI();
  const [lastEvent, resolve] = withResolvers<string>();

  (async () => {
    let lastEventValue: StreamEvent | null = null;

    const callbacks: Record<
      string,
      ReturnType<typeof createStreamableUI | typeof createStreamableValue>
    > = {};

    for await (const streamEvent of (
      runnable as Runnable<RunInput, RunOutput>
    ).streamEvents(inputs, {
      version: "v2",
    })) {
      if (
        streamEvent.name === CUSTOM_EVENT_NAME &&
        isValidElement(streamEvent.data.output.value)
      ) {
        if (streamEvent.data.output.type === "append") {
          ui.append(streamEvent.data.output.value);
        } else if (streamEvent.data.output.type === "update") {
          ui.update(streamEvent.data.output.value);
        }
      }

      if (streamEvent.event === "on_chat_model_stream") {
        const chunk = streamEvent.data.chunk;

        if ("text" in chunk && typeof chunk.text === "string") {
          if (!callbacks[streamEvent.run_id]) {
            const textStream = createStreamableValue();
            ui.append(<AIMessage value={textStream.value} />);
            callbacks[streamEvent.run_id] = textStream;
          }

          callbacks[streamEvent.run_id].append(chunk.text);
        }
      }

      lastEventValue = streamEvent;
    }

    resolve(lastEventValue?.data.output);

    Object.values(callbacks).forEach((cb) => cb.done());
    ui.done();
  })();

  return { ui: ui.value, lastEvent };
}

export function withResolvers<T>() {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;

  const innerPromise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // @ts-expect-error
  return [innerPromise, resolve, reject] as const;
}

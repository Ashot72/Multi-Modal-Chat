"use client";

import { AIMessageComponent, AIMessageText } from "@/components/message";

export const VideoLoading = () => (
  <AIMessageComponent>
    <div style={{ width: "600px", height: "300px" }}>
      <p className="placeholder-glow">
        <span
          className="placeholder col-8"
          style={{ height: "30px", backgroundColor: "#ccc" }}
        ></span>
        <span
          className="placeholder w-50"
          style={{ height: "20px", backgroundColor: "#ccc" }}
        ></span>
      </p>

      <p className="placeholder-wave">
        <span
          className="placeholder w-75"
          style={{ height: "25px", backgroundColor: "#ccc" }}
        ></span>
      </p>

      <p className="placeholder-glow">
        <span
          className="placeholder col-4"
          style={{ height: "40px", backgroundColor: "#ccc" }}
        ></span>
      </p>

      <div
        className="placeholder-glow"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
        }}
      ></div>
    </div>
  </AIMessageComponent>
);

export const Video = ({ videoId }: { videoId: string }) => {
  const width = 750;
  const height = (width * 9) / 16;

  return (
    <>
      {videoId ? (
        <AIMessageComponent>
          <div
            style={{
              position: "relative",
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Video"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
        </AIMessageComponent>
      ) : (
        <AIMessageText content="No valid YouTube URL found" />
      )}
    </>
  );
};

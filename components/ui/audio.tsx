"use client";

import { AIMessageComponent } from "@/components/message";

export const AudioLoading = () => (
  <AIMessageComponent>
    <div
      style={{
        width: "400px",
        height: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
      }}
    >
      <div
        className="placeholder-glow"
        style={{
          width: "80%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          className="placeholder col-8"
          style={{
            height: "25px",
            backgroundColor: "#ccc",
            flexGrow: 1,
          }}
        ></span>
        <span
          className="placeholder col-2"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#ccc",
          }}
        ></span>
      </div>
    </div>
  </AIMessageComponent>
);

export const Audio = ({ id }: { id: string }) => (
  <AIMessageComponent>
    <audio controls>
      <source src={`${id}.mp3`} type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  </AIMessageComponent>
);

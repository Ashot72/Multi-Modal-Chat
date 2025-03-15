"use client";

import { AIMessageComponent, AIMessageText } from "@/components/message";

export const DallEIamgeLoading = () => (
  <AIMessageComponent>
    <div
      style={{
        width: "512px",
        height: "512px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p className="placeholder-glow" style={{ width: "80%" }}>
        <span
          className="placeholder col-10"
          style={{ height: "40px", backgroundColor: "#ccc", display: "block" }}
        ></span>
      </p>

      <p className="placeholder-wave" style={{ width: "70%" }}>
        <span
          className="placeholder w-75"
          style={{ height: "30px", backgroundColor: "#ccc", display: "block" }}
        ></span>
      </p>

      <p className="placeholder-glow" style={{ width: "60%" }}>
        <span
          className="placeholder col-6"
          style={{ height: "35px", backgroundColor: "#ccc", display: "block" }}
        ></span>
      </p>

      <div
        className="placeholder-glow"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          margin: "20px 0",
        }}
      ></div>

      <p className="placeholder-glow">
        <span
          className="placeholder col-4"
          style={{
            height: "45px",
            backgroundColor: "#ccc",
            display: "block",
            width: "120px",
            borderRadius: "8px",
          }}
        ></span>
      </p>
    </div>
  </AIMessageComponent>
);

export const DalleImage = ({ url }: { url: string | undefined }) => (
  <>
    {url ? (
      <AIMessageComponent>
        <img src={url} alt="image" />
      </AIMessageComponent>
    ) : (
      <AIMessageText content="The image is not generated" />
    )}
  </>
);

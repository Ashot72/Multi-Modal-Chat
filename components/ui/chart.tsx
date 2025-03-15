"use client";

import { useRef, useEffect } from "react";
import { Chart, ChartTypeRegistry, registerables } from "chart.js";
import { AIMessageComponent } from "@/components/message";

// Register all available components
Chart.register(...registerables);

interface ChartJSProps {
  title: string;
  type: string;
  data: {
    label: string;
    value: number;
  }[];
}

export const ChartJS = (props: ChartJSProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const backgroundColor = [
    "#b91d47", // Red
    "#00aba9", // Teal
    "#2b5797", // Blue
    "#e8c3b9", // Light Pink
    "#1e7145", // Dark Green
    "#ff5733", // Orange
    "#900c3f", // Maroon
    "#581845", // Purple
    "#ffd700", // Gold
    "#4caf50", // Green
    "#ff9800", // Deep Orange
    "#2196f3", // Bright Blue
    "#673ab7", // Deep Purple
    "#ffeb3b", // Yellow
  ];

  const downloadChart = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "chart.png";
      link.click();
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      // reactStrictMode calling twice
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart
      chartInstanceRef.current = new Chart(ctx, {
        type: props.type as keyof ChartTypeRegistry,
        data: {
          labels: props.data.map((d) => d.label),
          datasets: [
            {
              label: props.title,
              data: props.data.map((d) => d.value),
              backgroundColor,
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart when component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <i
        className="fas fa-download"
        style={{ cursor: "pointer", marginLeft: "235px" }}
        title="Download"
        onClick={downloadChart}
      />
      <AIMessageComponent>
        <div style={{ width: "600px", height: "auto" }}>
          <canvas ref={canvasRef} />
        </div>
      </AIMessageComponent>
    </>
  );
};

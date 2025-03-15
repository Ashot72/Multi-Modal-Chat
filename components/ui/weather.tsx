"use client";

import { AIMessageComponent, AIMessageText } from "@/components/message";

interface Forecast {
  date: string;
  temperature: number;
  weather_description: string;
  humidity: number;
  wind_speed: number;
}

interface WeatherProps {
  id: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  weather_description: string;
  humidity: number;
  wind_speed: number;
  forecast: Forecast[];
}

export const WeatherLoading = () => (
  <AIMessageComponent>
    <div
      className="text-white text-center p-3"
      style={{ borderRadius: "15px", width: "450px" }}
    >
      <div className="card-body">
        <div
          className="p-3 rounded"
          style={{ width: "400px", height: "200px" }}
        >
          <div className="placeholder-glow d-flex justify-content-around">
            <span
              className="placeholder col-4"
              style={{ backgroundColor: "#ccc" }}
            ></span>
            <span
              className="placeholder col-2"
              style={{ backgroundColor: "#ccc" }}
            ></span>
          </div>
          <div className="placeholder-glow">
            <span
              className="placeholder col-4"
              style={{ backgroundColor: "#ccc" }}
            ></span>
          </div>
          <div className="d-flex justify-content-center my-2">
            <span
              className="placeholder rounded-circle"
              style={{ width: "40px", height: "40px", backgroundColor: "#ccc" }}
            ></span>
          </div>
          <div className="d-flex justify-content-around">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="text-center placeholder-glow">
                  <span
                    className="placeholder rounded-circle"
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#ccc",
                    }}
                  ></span>
                  <p
                    className="placeholder col-6"
                    style={{ backgroundColor: "#ccc", marginTop: "6px" }}
                  ></p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </AIMessageComponent>
);
function generateRandomValues(baseValue: number) {
  const times = ["7am", "8am", "9am", "10am", "11am", "12pm", "1pm"];

  const randomValues = [];
  for (let i = 0; i < 7; i++) {
    const randomValue = (baseValue + (Math.random() * 40 - 20)).toFixed(2); // Random value between -20 and +20
    randomValues.push({ time: times[i], temp: parseFloat(randomValue) });
  }
  return randomValues;
}

export const Weather = (props: WeatherProps) => (
  <>
    {props && Object.keys(props).length > 0 ? (
      <AIMessageComponent>
        <div
          className="text-white text-center"
          style={{
            backgroundColor: "#39c0ed",
            borderRadius: "15px",
            width: "430px",
          }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <span className="fs-6">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </span>
              <span className="fs-6">{props.weather_description}</span>
            </div>

            <div className="d-flex flex-column align-items-center mt-2">
              <h1 className="fw-bold">{props.temperature}°</h1>
              <i className="fas fa-sun fa-3x text-warning"></i>
            </div>

            <div className="d-flex justify-content-around mt-3">
              {generateRandomValues(props.temperature).map((hour, index) => (
                <div
                  key={index}
                  className="d-flex flex-column align-items-center"
                >
                  <span className="fs-6">{hour.time}</span>
                  <i className="fas fa-sun text-warning"></i>{" "}
                  <span className="fs-6">{hour.temp}°</span>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-end">Fake API Data</div>
          </div>
        </div>
      </AIMessageComponent>
    ) : (
      <AIMessageText content="No data found for the city." />
    )}
  </>
);

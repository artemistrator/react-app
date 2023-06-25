import React, { useState, useEffect } from "react";
import { fetchDataWeather } from "../API/api";

const WeatherCard = ({ cityName }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async (city) => {
      try {
        const data = await fetchDataWeather(city);
        setWeatherData(data);
      } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error);
      }
    };

    fetchWeatherData(cityName);
  }, [cityName]);

  if (!weatherData) {
    return null;
  }

  const { location, current } = weatherData;

  return (
    <div className="p-4 mx-auto max-w-xs">
      <div className="flex items-center mb-4">
        <div className="w-1/2">
          <img
            className="h-auto"
            src={current?.condition?.icon}
            alt="weather icon"
          />
        </div>
        <div className="w-1/2">
          <p className="mb-2">
            <span className="font-semibold text-2xl">{location?.name}</span>
          </p>
          <p className="mb-2">
            <span className="font-semibold text-6xl">{current?.temp_c}°C</span>
          </p>
          <p>
            <span className="font-semibold text-2xl">
              {current?.condition?.text}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

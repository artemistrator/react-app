import React, { useState, useEffect } from "react";


const WeatherCard = ({ weatherData }) => {
  
  // Остальной код компонента WeatherCard без изменений

  return (
    <div className="p-4 mx-auto max-w-xs">
      {weatherData && (
        <div className="flex items-center mb-4">
          <div className="w-1/2">
            <img
              className="h-auto"
              src={weatherData.current.condition.icon}
              alt="weather icon"
            />
          </div>
          <div className="w-1/2">
            <p className="mb-2">
              <span className="font-semibold text-2xl">
                {weatherData.location.name}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-6xl">
                {weatherData.current.temp_c}°C
              </span>
            </p>
            <p>
              <span className="font-semibold text-2xl">
                {weatherData.current.condition.text}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;

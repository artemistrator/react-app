import React, { useState } from "react";
import { fetchDataWeather } from "../API/api";

const FadeListItem = ({
  city,
  weatherData,
  handleRemoveFromFavorites,
  handleListItemClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = async () => {
    if (weatherData) {
      handleListItemClick(city, weatherData);
    } else {
      try {
        const data = await fetchDataWeather(city);
        handleListItemClick(city, data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <li className={`flex items-center justify-between mb-1 border-b ${isExpanded ? "" : ""}`}>
    <div className="w-full  mt-4 mb-2">
      <div onClick={handleClick} className="cursor-pointer flex items-center justify-between">
        <span className="text-lg font-medium w-[200px]">{city}</span>
        {weatherData && (
          <div className="flex items-center">
            <span className="text-lg font-medium">{weatherData.current?.temp_c}°C</span>
            <img className="h-8 ml-2" src={weatherData.current?.condition?.icon} alt="weather icon" />
          </div>
        )}
        <button className="bg-red-500 text-gray-100 rounded px-2 py-1" onClick={() => handleRemoveFromFavorites(city)}>
          Удалить
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm">Облачность: {weatherData.current?.cloud}%</span>
          </div>
          <div>
            <span className="text-sm">UV индекс: {weatherData.current?.uv}</span>
          </div>
          <div>
            <span className="text-sm">Влажность: {weatherData.current?.humidity}%</span>
          </div>
          <div>
            <span className="text-sm">Ветер: {weatherData.current?.wind_kph} км/ч</span>
          </div>
        </div>
      )}
    </div>
  </li>
  );
};

export default FadeListItem;

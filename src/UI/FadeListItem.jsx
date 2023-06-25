import React from "react";

const FadeListItem = ({
  city,
  weatherData,
  handleRemoveFromFavorites,
  state,
}) => {
  return (
    <li className="flex items-center justify-between mb-2 border-b border-gray-300 pb-2 ">
      <span>{city}</span>
      {weatherData && (
        <>
          <span>{weatherData.current?.temp_c}°C</span>
          <img
            className="h-auto"
            src={weatherData.current?.condition?.icon}
            alt="weather icon"
          />
        </>
      )}
      <button
        className="bg-red-500 text-white rounded px-4 py-2 mb-2 mx-4"
        onClick={() => handleRemoveFromFavorites(city)}
      >
        Удалить
      </button>
    </li>
  );
};

export default FadeListItem;

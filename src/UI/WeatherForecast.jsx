import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/ru"; // Import Russian locale for moment


const WeatherForecast = ({ weatherData }) => {

const { forecast } = weatherData;

  // Set locale to Russian
  moment.locale("ru");

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-4 flex justify-center">
        Прогноз погоды на 3 дня
      </h2>
      <div className="grid gap-4 md:grid-cols-3 w-1/3 mx-auto ">
        {forecast?.forecastday?.map((day) => (
          <div
            key={day.date}
            className="bg-white bg-opacity-40 backdrop-filter backdrop-blur-md rounded-lg shadow-lg p-4 mx-auto"
          >
            <h3 className="text-lg font-semibold mb-2">
              {moment(day.date).format("D MMMM YYYY")}
            </h3>
            <p>Днем: {day.day?.maxtemp_c}°C</p>
            <p>Ночью: {day.day?.mintemp_c}°C</p>
            <p>Погода: {day.day?.condition?.text}</p>
            <img
              className="w-auto mx-auto"
              src={day.day?.condition?.icon}
              alt="weather icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;

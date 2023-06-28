import { useState, useEffect } from "react";

const apiKeyWeatherApi = "a986871a77a744e6937134718230203";
const apiUrlWeatherApi = `http://api.weatherapi.com/v1/forecast.json?key=${apiKeyWeatherApi}`;

const useCityName = () => {
  const [cityName, setCityName] = useState(); // Изменили имя переменной

  const setNewCityName = (newCityName) => {
    setCityName(newCityName);
  };

  return [cityName, setNewCityName];
};

const fetchDataWeather = async (city) => {
  try {
    console.log("city", city);
    const resultDataWeather = await fetch(
      `${apiUrlWeatherApi}&q=${city}&days=3&lang=ru`
    );
    const dataWeather = await resultDataWeather.json();
    return dataWeather;
  } catch (error) {
    console.log("Произошла ошибка при получении данных о погоде:", error);
    throw error;
  }
};

const fetchCitySuggestions = async (value) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=${apiKeyWeatherApi}&q=${value}&lang=ru`
    );
    const data = await response.json();
    const suggestedCities = data.map((city) => city.name);
    return suggestedCities;
  } catch (error) {
    console.log("Произошла ошибка при получении предлагаемых городов:", error);
    throw error;
  }
};

export { fetchDataWeather, fetchCitySuggestions, useCityName };

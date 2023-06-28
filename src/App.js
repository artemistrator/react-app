import React, { useState, useEffect } from "react";
import { fetchDataWeather, fetchCitySuggestions, useCityName } from "./API/api";
import WeatherCard from "./UI/WeatherCard";
import WeatherForecast from "./UI/WeatherForecast";
import Auth from "./UI/Auth";
import { auth } from "./firebase/firebase";
import CitySearch from "./UI/CitySearch";
import FavoriteCities from "./UI/FavoriteCities";
import "./UI/FavoriteCities.css";
import { ReactComponent as MoonIcon } from './img/moon.svg';
const App = () => {
  const [user, setUser] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [favoriteCity, setFavoriteCity] = useState(null);
  const [cityName, setCityName] =  useState("Москва");
  const [selectedCityWeather, setSelectedCityWeather] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const fetchWeatherData = async (city) => {
      try {
        const data = await fetchDataWeather(city);
        console.log("Fetched weather data:", data);
        setWeatherData(data);
      } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error);
      }
    };

    console.log("Selected city:", cityName);
    fetchWeatherData(cityName);
  }, [cityName]);

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCityClick = async (city) => {
    console.log("Clicked city:", city);
    try {
      await setCityName(city);
      const weatherData = await fetchDataWeather(city);
      setWeatherData(weatherData);
      setSelectedCityWeather(weatherData);
    } catch (error) {
      console.error("Ошибка при выборе города:", error);
    }
  };

  const handleAddWeather = async (city, weatherData) => {
    try {
      await setCityName(city);
      console.log("Selected city:", city);
      console.log("Fetched weather data:", weatherData);
      setWeatherData(weatherData);
      setSelectedCityWeather(weatherData);
    } catch (error) {
      console.error("Ошибка при установке названия города:", error);
    }
  };

  const handleSelectCity = (city) => {
    setCityName(city);
    console.log("Selected city:", city);
  };
  console.log("weatherData",weatherData);
  return (
    <section className={`custom-transition flex flex-col items-center  w-full h-screen ${isDarkMode ? "dark" : "light"}`}>
      {user ? (
        <div className=" w-full py-16  flex flex-col items-center">
          <div className="flex justify-between mb-4 w-full">
            <h1 className=" container text-2xl font-bold mx-4">
              Привет, {user.email}
            </h1>
            <div className="flex mx-4">
            <button
              className="theme bg-red-400 text-black rounded px-4 py-2 mb-2 mx-4"
              onClick={handleLogout}
            >
              Выйти
            </button>
            <button
              className="theme bg-blue-600 text-black rounded-3xl px-4 py-2 mb-2 mx-4"
              onClick={toggleDarkMode}
            >
              <MoonIcon className="w-8 h-8" />
             
            </button>
            </div>
          </div>

          <CitySearch handleAddWeather={handleAddWeather} />
          <FavoriteCities
            onCityClick={setCityName}

            favoriteCity={favoriteCity}
            setFavoriteCity={setFavoriteCity}
            handleAddWeather={handleAddWeather}
            handleSelectCity={handleSelectCity}
          />

          <div className="container mx-auto mt-8">
          <WeatherCard  weatherData={weatherData} />

            <WeatherForecast weatherData={weatherData} />
          </div>
        </div>
      ) : (
        <Auth onAuthSuccess={setUser} />
      )}
    </section>
  );
};

export default App;

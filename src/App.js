import React, { useState, useEffect } from "react";
import { fetchDataWeather, fetchCitySuggestions, useCityName } from "./API/api";

import WeatherCard from "./UI/WeatherCard";
import WeatherForecast from "./UI/WeatherForecast";
import Auth from "./UI/Auth";
import { auth } from "./firebase/firebase";
import CitySearch from "./UI/CitySearch";
import FavoriteCities from "./UI/FavoriteCities";

const App = () => {
  const [selectedCity, setSelectedCity] = useCityName();
  const [user, setUser] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

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
    console.log("Selected city:", selectedCity);
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

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

  const handleCityClick = (city) => {
    setSelectedCity(city);
    console.log(city);
  };

  return (
    <section
      className="w-full h-screen py-16"
      style={{
        backgroundImage: `url(${require("./img/background.jpg")})`,
        backgroundSize: "cover",
      }}
    >
      {user ? (
        <div className="w-full py-16 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Привет, {user.email}</h1>{" "}
          {/* Приветственное сообщение */}
          <CitySearch />
          <FavoriteCities onCityClick={handleCityClick} />
          <div className="container mx-auto mt-8">
            <WeatherCard cityName={selectedCity} />
            <WeatherForecast cityName={selectedCity} />
          </div>
          <button
            className="bg-blue-500 text-white rounded px-4 py-2 mb-2 mx-auto"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      ) : (
        <Auth onAuthSuccess={setUser} />
      )}
    </section>
  );
};

export default App;

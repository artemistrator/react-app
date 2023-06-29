import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import { fetchDataWeather } from "../API/api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./FavoriteCities.css";
import FadeListItem from "./FadeListItem";
import WeatherCard from "./WeatherCard";
import { useCityName } from "../API/api";

const FavoriteCities = () => {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [user, setUser] = useState(null);
  const [weatherDataMap, setWeatherDataMap] = useState({});
  const [favoriteCity, setFavoriteCity] = useState(null);
  const [selectedCityWeather, setSelectedCityWeather] = useState(null);
  //const [cityName, setCityName] = useCityName();


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleRemoveFromFavorites = async (city) => {
    try {
      await updateDoc(doc(firestore, "users", user.uid), {
        favoriteCities: arrayRemove(city),
      });
      console.log(`Город "${city}" удален из избранного.`);
    } catch (error) {
      console.error("Ошибка при удалении города из избранного:", error);
    }
  };

  const handleAddWeather = async (city, weatherData) => {
    try {
    //  await setCityName(city); // Установите название города
      console.log("Selected city:", city);
      console.log("Fetched weather data:", weatherData); // Добавленный console.log
      setSelectedCityWeather(weatherData); // Обновляем selectedCityWeather
    } catch (error) {
      console.error("Ошибка при установке названия города:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect (onAuthStateChanged)");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      console.log("cleanup (onAuthStateChanged)");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("useEffect (onSnapshot)");
    if (user) {
      const unsubscribe = onSnapshot(
        doc(firestore, "users", user.uid),
        (doc) => {
          const userData = doc.data();
          if (
            userData &&
            userData.favoriteCities &&
            Array.isArray(userData.favoriteCities)
          ) {
            console.log("Data from Firestore:", userData.favoriteCities);
            setFavoriteCities(userData.favoriteCities);
          } else {
            setFavoriteCities([]);
          }
        }
      );

      return () => {
        console.log("cleanup (onSnapshot)");
        unsubscribe();
      };
    } else {
      setFavoriteCities([]);
    }
  }, [user]);

  useEffect(() => {
    console.log("useEffect (handleGetWeather)");

    const fetchWeatherData = async () => {
      for (const city of favoriteCities) {
        try {
          const updDataWeather = await fetchDataWeather(city);
          setWeatherDataMap((prevDataMap) => ({
            ...prevDataMap,
            [city]: updDataWeather,
          }));
          console.log(`Город "${city}" получил данные.`);
          console.log(updDataWeather);
        } catch (error) {
          console.error("Ошибка при получении данных:", error);
        }
      }
    };

    fetchWeatherData();
  }, [favoriteCities]);

  const handleListItemClick = (city, weatherData) => {
    handleAddWeather(city, weatherData);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedCities = favoriteCities.slice(startIndex, endIndex);

  return (
    <div className="mx-auto w-full sm:w-[600px]">
      <h2 className="text-xl font-bold mb-4 my-4">Избранные города</h2>
      
      <ul>
        <TransitionGroup>
          {displayedCities.map((city) => {
            const weatherData = weatherDataMap[city];

            return (
              <CSSTransition key={city} timeout={750} classNames="fade">
                <FadeListItem
                  city={city}
                  weatherData={weatherData}
                  handleRemoveFromFavorites={handleRemoveFromFavorites}
                  handleListItemClick={handleListItemClick}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </ul>

      {favoriteCities.length > pageSize && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-200 text-black px-4 py-2 mr-2"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <button
            className="bg-blue-200 text-black px-4 py-2"
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(favoriteCities.length / pageSize)}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};


export default FavoriteCities;

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

const FavoriteCities = () => {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [user, setUser] = useState(null);
  const [weatherDataMap, setWeatherDataMap] = useState({});

  console.log("favoriteCities (before useEffect):", favoriteCities);

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
          const dataWeather = await fetchDataWeather(city);
          setWeatherDataMap((prevDataMap) => ({
            ...prevDataMap,
            [city]: dataWeather,
          }));
          console.log(`Город "${city}" получил данные.`);
          console.log(dataWeather);
        } catch (error) {
          console.error("Ошибка при получении данных:", error);
        }
      }
    };

    fetchWeatherData();
  }, [favoriteCities]);

  console.log("favoriteCities (after useEffect):", favoriteCities);

  return (
    <div className="mx-auto w-[600px]">
      <h2 className="text-xl font-bold mb-4 my-4">Избранные города</h2>
      <ul>
        <TransitionGroup>
          {favoriteCities.map((city) => {
            const weatherData = weatherDataMap[city];

            return (
              <CSSTransition key={city} timeout={750} classNames="fade">
                <FadeListItem
                  city={city}
                  weatherData={weatherData}
                  handleRemoveFromFavorites={handleRemoveFromFavorites}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </ul>
    </div>
  );
};

export default FavoriteCities;

import React, { useState, useEffect, useRef } from "react";
import { fetchCitySuggestions } from "../API/api";
import { firestore, auth } from "../firebase/firebase";
import {
  collection,
  updateDoc,
  arrayUnion,
  getDoc,
  doc,
} from "firebase/firestore";

const CitySearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [user, setUser] = useState(null);
  const suggestionsRef = useRef();

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    try {
      const response = await fetchCitySuggestions(value);
      if (Array.isArray(response)) {
        setCitySuggestions(response);
      }
    } catch (error) {
      console.error("Ошибка при получении предлагаемых городов:", error);
    }
  };

  const handleAddToFavorites = async (city) => {
    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userDocData = userDocSnapshot.data();
        const favoriteCities = userDocData.favoriteCities || [];

        if (!favoriteCities.includes(city)) {
          const updatedFavoriteCities = [...favoriteCities, city];

          await updateDoc(userDocRef, {
            favoriteCities: updatedFavoriteCities,
          });
          console.log(`Город "${city}" добавлен в избранное.`);
        } else {
          console.log(`Город "${city}" уже находится в избранном.`);
        }
      }
    } catch (error) {
      console.error("Ошибка при добавлении города в избранное:", error);
    }
  };

  const handleOutsideClick = (e) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
      setCitySuggestions([]);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    document.addEventListener("click", handleOutsideClick);

    return () => {
      unsubscribe();
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Поиск города</h2>
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Введите название города"
        className="border border-gray-300 rounded px-4 py-2 mb-4 w-full sm:w-[600px] my-4"
      />
      {citySuggestions.length > 0 && (
        <ul ref={suggestionsRef}>
          {citySuggestions.map((city) => (
            <li
              key={city}
              className="flex items-center justify-between mb-2 border-b border-gray-300 pb-2"
            >
              <span>{city}</span>
              <button
                className="bg-blue-500 text-white rounded px-4 py-2 mb-2 mx-4"
                onClick={() => handleAddToFavorites(city)}
              >
                Добавить в избранное
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default CitySearch;

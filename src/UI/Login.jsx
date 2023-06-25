import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Login = ({ handleBack, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // Состояние авторизации пользователя

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // User login successful
      console.log("User logged in:", userCredential.user);
      setIsLoggedIn(true); // Устанавливаем значение isLoggedIn в true
      setLoggedIn(true); // Устанавливаем значение loggedIn в true
      handleBack();
    } catch (error) {
      setError(error.message);
    }
  };

  // Условный рендеринг
  if (loggedIn) {
    return <p>Добро пожаловать! Отображение погоды...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-8">Вход</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          className="px-4 py-2 mr-2 text-white bg-gray-200 rounded hover:bg-gray-100"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="px-4 py-2 mr-2 text-white bg-gray-200 rounded hover:bg-gray-100"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          type="submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;

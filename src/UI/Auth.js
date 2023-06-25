import React, { useState } from "react";
import { auth, firestore } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Auth = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        onAuthSuccess(userCredential.user);
        console.log("Успешный вход:", userCredential.user);
      })
      .catch((error) => {
        console.error("Ошибка входа:", error);
      });
  };

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        onAuthSuccess(userCredential.user);

        // Создание документа пользователя в Firestore
        const userDocRef = doc(firestore, "users", userCredential.user.uid);
        const userData = {
          email: userCredential.user.email,
        };
        setDoc(userDocRef, userData)
          .then(() => {
            console.log("Документ пользователя создан в Firestore");
          })
          .catch((error) => {
            console.error("Ошибка при создании документа пользователя:", error);
          });

        console.log("Успешная регистрация:", userCredential.user);
      })
      .catch((error) => {
        console.error("Ошибка регистрации:", error);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Регистрация / Вход</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className="border border-gray-300 rounded px-2 py-1 mb-2"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={handlePasswordChange}
        className="border border-gray-300 rounded px-2 py-1 mb-2"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white rounded px-4 py-2 mb-2 mx-auto"
      >
        Войти
      </button>
      <button
        onClick={handleSignup}
        className="bg-green-500 text-white rounded px-4 py-2"
      >
        Зарегистрироваться
      </button>
    </div>
  );
};

export default Auth;

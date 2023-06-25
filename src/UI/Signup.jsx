import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // User registration successful
      console.log("User registered:", userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-8">Регистрация</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          id="email"
          className="px-4 py-2 mr-2 text-white bg-gray-200 rounded hover:bg-gray-100"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          id="password"
          className="px-4 py-2 mr-2 text-white bg-gray-200 rounded hover:bg-gray-100"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default SignUp;

import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/userActions";
import Register from "./Register";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });
      toast.success("Login successful!", { id: toastId });
      console.log("Login successful:", response.data);
      dispatch(setUser(response.data.user, response.data.token));
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      toast.error(
        "Login error: " +
          (error.response ? error.response.data.message : error.message),
        { id: toastId }
      );
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        {isRegister ? (
          <Register />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                Login
              </button>
            </form>
          </>
        )}
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            navigate(isRegister ? "/login" : "/register");
          }}
          className="w-full px-4 py-2 mt-4 font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          {isRegister ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;

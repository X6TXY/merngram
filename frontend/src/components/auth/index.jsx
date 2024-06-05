import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

export const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    profilepicture: null,
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilepicture") {
      setFormData({
        ...formData,
        profilepicture: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? "http://localhost:8000/api/auth/register"
      : "http://localhost:8000/api/auth/login";
    let response;

    if (isRegister) {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      if (formData.profilepicture) {
        formDataToSend.append("profilepicture", formData.profilepicture);
      }

      console.log("Form Data to send:", [...formDataToSend]);

      try {
        response = await axios.post(url, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error(
          "Authentication failed:",
          error.response ? error.response.data : error.message
        );
        alert("Authentication failed!");
        return;
      }
    } else {
      const jsonDataToSend = {
        username: formData.username,
        password: formData.password,
      };

      console.log("JSON Data to send:", jsonDataToSend);

      try {
        response = await axios.post(url, jsonDataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(
          "Authentication failed:",
          error.response ? error.response.data : error.message
        );
        return;
      }
    }

    console.log("Response:", response.data);
    const { token, refreshToken } = response.data;
    login(token, refreshToken);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {isRegister ? "Register" : "Login"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border rounded"
              />
            </label>
          </div>
          {isRegister && (
            <div className="mb-4">
              <label className="block text-gray-700">
                Profile Picture:
                <input
                  type="file"
                  name="profilepicture"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1"
                />
              </label>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
};

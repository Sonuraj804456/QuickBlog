import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Login = () => {

  const { axios, setToken } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">

        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> Login
            </h1>
            <p className="font-light">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* 🔐 DEMO CREDENTIALS */}
          <div className="w-full mb-6 p-3 bg-gray-100 rounded text-sm text-gray-700">
            <p className="font-semibold mb-1">Demo Admin Credentials</p>
            <p>
              <span className="font-medium">Email:</span> admin@example.com
            </p>
            <p>
              <span className="font-medium">Password:</span> Sonu_blog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            
            {/* Email */}
            <div className="mb-6">
              <label>Email</label>
              <input
                type="email"
                required
                placeholder="your email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b-2 border-gray-300 p-2 outline-none w-full"
              />
            </div>

            {/* Password */}
            <div className="mb-8">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b-2 border-gray-300 p-2 outline-none w-full"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded-full cursor-pointer"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

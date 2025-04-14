import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // فایل CSS برای دیزاین جدید

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username); // اضافه کردن این خط
        console.log("Saved token:", response.data.token); // برای دیباگ
        navigate("/products");
      }
    } catch (err) {
      setError("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  return (
    <div className="login-page">
      {/* کانتینر فرم لاگین */}
      <div className="login-container">
        <div className="login-header">
        <img src="/icons/zima1.jpg" alt="logo" className="logo" />
        <p>لطفاً نام کاربری و رمز عبور خود را وارد کنید</p>
        </div>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder=" ایمیل یا شماره موبایل یا نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="forgot-password">
            <a href="/signup">ساخت حساب کاربری</a>
          </div>
          <button type="submit" className="login-button">
            ورود
          </button>
        </form>
        <div className="support-info">
          <p>تلفن پشتیبانی: 021-12345678</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // استفاده از همان فایل CSS صفحه لاگین

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/signup/", {
        username,
        password,
        email,
        phone_number: phoneNumber,
      });

      if (response.status === 201) {
        setSuccess("ثبت‌نام با موفقیت انجام شد!");
        setTimeout(() => {
          navigate("/"); // انتقال به صفحه لاگین
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(", ");
        setError(errorMessages);
      } else {
        setError("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>ثبت‌نام</h2>
          <p>لطفاً اطلاعات خود را وارد کنید</p>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="نام کاربری"
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
          <div className="input-group">
            <input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="شماره تلفن"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            ثبت‌نام
          </button>
        </form>
        <div className="support-info">
          <p>
            قبلاً ثبت‌نام کرده‌اید؟ <a href="/">وارد شوید</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
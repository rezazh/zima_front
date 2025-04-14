// src/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userName = localStorage.getItem("username");

  return (
    <header className="main-header">
      <div className="right-section">
        <div className="user-dropdown">
          <button 
            className="user-btn" 
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span>{userName}</span>
            <span>عزیز</span>
          </button>
          {showUserMenu && (
            <div className="dropdown-menu">
              <Link to="/orders">
                <img src="/icons/orders.svg" alt="" />
                سفارشات من
              </Link>
              <Link to="/favorites">
                <img src="/icons/favorites.svg" alt="" />
                علاقه‌مندی‌ها
              </Link>
              <button onClick={() => {
                localStorage.removeItem("username");
                navigate("/login");
              }}>
                <img src="/icons/logout.svg" alt="" />
                خروج
              </button>
            </div>
          )}
        </div>
        <Link to="/cart" className="icon-btn cart-btn">
          <img src="/icons/cart.svg" alt="cart" />
        </Link>
        <button className="icon-btn search-btn">
          <img src="/icons/search.svg" alt="search" />
        </button>
      </div>

      <nav className="main-nav">
        <Link to="/tracking">کد های رهگیری سفارشات</Link>
        <Link to="/girls">دخترانه</Link>
        <Link to="/boys">پسرانه</Link>
        <Link to="/men">مردانه</Link>
        <Link to="/women">زنانه</Link>
        <Link to="/underwear">فروشگاه لباس زیر</Link>
      </nav>

      <div className="left-section">
        <Link to="/">
          <img src="/icons/zima.jpg" alt="logo" className="logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
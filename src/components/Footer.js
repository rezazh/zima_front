// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const socialLinks = {
    instagram: "https://instagram.com/your-account", // لینک اینستاگرام خود را اینجا قرار دهید
    telegram: "https://t.me/your-account", // لینک تلگرام خود را اینجا قرار دهید
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ارتباط با ما</h3>
          <p>آدرس: تهران، بازار بزرگ تهمیه حاجب الدوله دالان ۴ فروشگاه مرکزی پلاک ۱۴۸ و ۱۴۹</p>
          <p>تلفن: ۰۲۱۵۵۶۱۷۷۳۳-۰۲۱۵۵۶۱۶۶۷۰</p>
          <p>ایمیل: sharrgh@gmail.com</p>
          <div className="social-links">
            <p>ما را در شبکه های اجتماعی دنبال کنید.</p>
            <div className="social-icons">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <img src="/icons/instagram.svg" alt="Instagram" />
              </a>
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                <img src="/icons/telegram.svg" alt="Telegram" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>آخرین های بلاگ</h3>
          <ul>
            <li><Link to="/blog/sports-bra">سوتین ورزشی چیست؟</Link></li>
            <li><Link to="/blog/elastic-bra">سوتین الاستیکی چیست؟</Link></li>
            <li><Link to="/blog/tight-bra">پوشیدن سوتین تنگ چه عوارضی دارد؟</Link></li>
            <li><Link to="/blog/corset">کرست چیست؟</Link></li>
            <li><Link to="/blog/best-shorts">بهترین شورت زنانه از نظر پزشکی کدام است؟</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>محصولات پرفروش</h3>
          <ul>
            <li><Link to="/underwear">فروشگاه لباس زیر</Link></li>
            <li><Link to="/women/underwear">لباس زیر زنانه</Link></li>
            <li><Link to="/women/bra">سوتین زنانه</Link></li>
            <li><Link to="/women/shorts">شورت زنانه</Link></li>
            <li><Link to="/women/tank-top">رکابی و نیم تنه کتی</Link></li>
            <li><Link to="/women/tank">تاپ زنانه</Link></li>
            <li><Link to="/women/sleepwear">لباس زیر مردانه</Link></li>
            <li><Link to="/men/shorts">شورت مردانه</Link></li>
            <li><Link to="/men/sleepwear">زیرپوش مردانه</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>لینک های مفید</h3>
          <ul>
            <li><Link to="/login">ورود / ثبت نام</Link></li>
            <li><Link to="/tracking">کد های رهگیری سفارشات</Link></li>
            <li><Link to="/contact">تماس با ما</Link></li>
            <li><Link to="/shipping">پلاک شرق</Link></li>
            <li><Link to="/sports-bra">سوتین اسفنجی</Link></li>
            <li><Link to="/seamless-bra">سوتین یکی زنانه</Link></li>
            <li><Link to="/fantasy-bra">سوتین فانتزی زنانه</Link></li>
            <li><Link to="/fantasy-shorts">شورت دنی زنانه</Link></li>
            <li><Link to="/fantasy-sets">شورت فانتزی زنانه</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="certificates">
          <img src="/images/cert1.png" alt="گواهی 1" />
          <img src="/images/cert2.png" alt="گواهی 2" />
        </div>
        <p className="copyright">
          هر گونه استفاده تجاری و ایرانی از این وب سایت به هر نحو ، کسب اجازه از مدیریت و سایت امکان پذیر است و در صورت نقض آن، این مسئله مورد پیگیرد قرار خواهد گرفت.
        </p>
        <p className="credits">
          طراحی و کدنویسی توسط <a href="https://example.com">تیم طراحی سایت</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
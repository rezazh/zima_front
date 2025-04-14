import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Header from '../components/Header';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import "swiper/css/navigation";
import "../styles/Products.css";

const Products = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [womenUnderwear, setWomenUnderwear] = useState([]);
  const [menUnderwear, setMenUnderwear] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // افزودن مکانیزم timeout برای جلوگیری از انتظار بیش از حد
      const timeout = setTimeout(() => {
        if (loading) {
          setError("زمان ارتباط با سرور به پایان رسید. لطفاً دوباره تلاش کنید.");
          setLoading(false);
        }
      }, 10000); // 10 ثانیه مهلت

      try {
        const [latestResponse, womenResponse, menResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/products/latest/'),
          axios.get('http://127.0.0.1:8000/api/products/women-underwear/'),
          axios.get('http://127.0.0.1:8000/api/products/men-underwear/')
        ]);

        clearTimeout(timeout);
        
        // بررسی و لاگ کردن داده‌ها برای دیباگ
        console.log("Latest products data:", latestResponse.data);
        console.log("Women underwear data:", womenResponse.data);
        console.log("Men underwear data:", menResponse.data);

        setLatestProducts(latestResponse.data || []);
        setWomenUnderwear(womenResponse.data || []);
        setMenUnderwear(menResponse.data || []);
      } catch (apiError) {
        clearTimeout(timeout);
        console.error('API Error:', apiError);
        
        if (apiError.response) {
          // خطای پاسخ سرور
          setError(`خطای سرور: ${apiError.response.status} - ${apiError.response.data.error || 'خطای نامشخص'}`);
        } else if (apiError.request) {
          // خطای عدم دریافت پاسخ
          setError("سرور پاسخ نمی‌دهد. لطفاً از اتصال به اینترنت و راه‌اندازی سرور اطمینان حاصل کنید.");
        } else {
          // خطای دیگر
          setError(`خطا در ارسال درخواست: ${apiError.message}`);
        }
      }
    } catch (error) {
      console.error('General Error:', error);
      setError("خطا در دریافت اطلاعات. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      title: "دخترانه",
      englishTitle: "Girls",
      color: "yellow",
      image: "/icons/girl.svg",
      path: "/girls"
    },
    {
      title: "پسرانه",
      englishTitle: "Boys",
      color: "green",
      image: "/icons/boy.svg",
      path: "/boys"
    },
    {
      title: "زنانه",
      englishTitle: "Women",
      color: "pink",
      image: "/icons/women.svg",
      path: "/women"
    },
    {
      title: "مردانه",
      englishTitle: "Men",
      color: "blue",
      image: "/icons/men.svg",
      path: "/men"
    }
  ];

  const sliderImages = [
    {
      image: "/images/slider/bra-slide.jpg",
      title: "انواع سوتین رو اینجا پیدا کن",
      buttonText: "راحت خرید کن",
      backgroundColor: "pink-slide"
    },
    {
      image: "/images/slider/towel-slide.jpg",
      title: "دیگه لازم نیست دنبال حوله بگردی",
      buttonText: "راحت خرید کن",
      backgroundColor: "green-slide"
    }
  ];

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-spinner">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-message">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button onClick={fetchInitialData} className="retry-button">تلاش مجدد</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <main>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000 }}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="main-slider"
        >
          {sliderImages.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={`slide ${slide.backgroundColor}`}>
                <div className="slide-content">
                  <h2>{slide.title}</h2>
                  <button className="shop-now">{slide.buttonText}</button>
                </div>
                <img src={slide.image} alt={slide.title} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <section className="categories-section">
          <div className="category-cards">
            {categories.map((category, index) => (
              <Link 
                to={category.path}
                className={`category-card ${category.color}`} 
                key={index}
              >
                <div className="image-container">
                  <img src={category.image} alt={category.title} />
                </div>
                <div className="category-content">
                  <h3>{category.title}</h3>
                  <span className="english-title">{category.englishTitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="latest-products-section">
          <div className="section-header">
            <h2>جدیدترین های زیما</h2>
          </div>
          {latestProducts.length > 0 ? (
            <ProductSlider products={latestProducts} />
          ) : (
            <div className="no-products">محصولی یافت نشد</div>
          )}
        </section>

        <section className="category-products-section">
          <div className="section-header">
            <h2>لباس زیر زنانه</h2>
            <Link to="/women-underwear" className="view-more-btn">
              مشاهده همه محصولات
              <span>+</span>
            </Link>
          </div>
          {womenUnderwear.length > 0 ? (
            <ProductSlider products={womenUnderwear} />
          ) : (
            <div className="no-products">محصولی یافت نشد</div>
          )}
        </section>

        <section className="category-products-section">
          <div className="section-header">
            <h2>لباس زیر مردانه</h2>
            <Link to="/men-underwear" className="view-more-btn">
              مشاهده همه محصولات
              <span>+</span>
            </Link>
          </div>
          {menUnderwear.length > 0 ? (
            <ProductSlider products={menUnderwear} />
          ) : (
            <div className="no-products">محصولی یافت نشد</div>
          )}
        </section>
      </main>
    </div>
  );
};

const ProductSlider = ({ products }) => {
  return (
    <Swiper
      modules={[Navigation]}
      navigation={true}
      slidesPerView={4}
      spaceBetween={20}
      breakpoints={{
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 }
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <Link to={`/product/${product.id}`} className="product-card">
            <img 
              src={product.image} 
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/fallback-product.jpg';
              }}
            />
            <div className="product-info">
              <h3 className="product-title">{product.name}</h3>
              <div className="price-container">
                {product.discount_price !== product.price && (
                  <span className="original-price">
                    {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
                  </span>
                )}
                <span className="product-price">
                  {new Intl.NumberFormat('fa-IR').format(product.discount_price || product.price)} تومان
                </span>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Products;
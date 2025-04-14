// src/components/ProductSlider.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/ProductSlider.css';

const ProductSlider = ({ products, title }) => {
  const navigate = useNavigate();
  if (!products || !Array.isArray(products)) {
    return null; // یا می‌توانید یک پیام مناسب نمایش دهید
  }
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  
  return (
    <div className="product-slider-container">
      {title && <h2 className="slider-title">{title}</h2>}
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="slider-item">
            <div 
              className="product-card" 
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.discount > 0 && (
                  <span className="discount-badge">
                    {Math.round((product.discount / product.price) * 100)}% تخفیف
                  </span>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                <div className="product-price">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">
                        {product.price.toLocaleString()} تومان
                      </span>
                      <span className="discounted-price">
                        {(product.price - product.discount).toLocaleString()} تومان
                      </span>
                    </>
                  ) : (
                    <span>{product.price.toLocaleString()} تومان</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom'; // برای لینک به صفحه جزئیات
import '../styles/ProductCard.css'; // اطمینان از import کردن استایل‌ها

const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

const ProductCard = ({ product }) => {
  if (!product || typeof product !== 'object') {
    console.warn("ProductCard received invalid product prop:", product);    return null;
  }

  const productName = product.name || 'نام محصول نامشخص';
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const originalPrice = typeof product.price === 'number' ? product.price : 0;
  const discountedPriceValue = typeof product.discount_price === 'number' ? product.discount_price : null;
  const imageUrl = product.image || PLACEHOLDER_IMAGE;
  const brand = product.brand || '';
  const isInStock = product.in_stock === true;  // *** تعریف productUrl در اینجا ***
  const productUrl = `/product/${product.id}`; // مطمئن شوید route شما به این شکل است


  let displayPrice = originalPrice;
  let actualOriginalPrice = null;
  if (discountedPriceValue !== null && discountedPriceValue < originalPrice) {
      displayPrice = discountedPriceValue;      actualOriginalPrice = originalPrice;
  }

  let discountPercent = null;
  if (actualOriginalPrice && displayPrice < actualOriginalPrice && actualOriginalPrice > 0) {
    discountPercent = Math.round(((actualOriginalPrice - displayPrice) / actualOriginalPrice) * 100);
  }

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '۰';
    return price.toLocaleString('fa-IR');
  };

  return (
    <div className={`product-card ${!isInStock ? 'out-of-stock' : ''}`}>
      {/* استفاده از productUrl تعریف شده */}
      <Link to={productUrl} className="product-image-link">
        <div className="product-image-wrapper">
          <img
            loading="lazy"
            src={imageUrl}
            alt={productName}
            className="product-image"
            onError={(e) => {
              if (e.target.src !== PLACEHOLDER_IMAGE) {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }
            }}
          />
          {discountPercent && discountPercent > 0 && (
            <span className="discount-percent-badge">٪{discountPercent}</span>
          )}
          {!isInStock && (
            <span className="out-of-stock-badge">ناموجود</span>
          )}
        </div>
      </Link>

      <div className="product-info">        {brand && <p className="product-brand">{brand}</p>}

        {/* استفاده از productUrl تعریف شده */}
        <Link to={productUrl} className="product-title-link">
          <h3 className="product-title" title={productName}>{productName}</h3>
        </Link>

        <div className="price-container">
          {actualOriginalPrice ? (
            <>
              <span className="discount-price">{formatPrice(displayPrice)} تومان</span>
              <span className="original-price">{formatPrice(actualOriginalPrice)} تومان</span>
            </>
          ) : (
            <span className="price">{formatPrice(displayPrice)} تومان</span>
          )}        </div>

        {colors.length > 0 && (
          <div className="product-colors">
            {colors.slice(0, 5).map((color, index) => (
              <span
                key={`${product.id}-color-${index}`}
                className="color-dot"
                title={color}
                style={{ backgroundColor: String(color).toLowerCase() }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
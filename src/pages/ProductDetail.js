import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/product/${productId}/`);
        setProduct(response.data);
        setMainImage(response.data.image);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات محصول');
        setLoading(false);
        toast.error('خطا در بارگذاری اطلاعات محصول');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.warning('لطفاً سایز و رنگ را انتخاب کنید');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/cart/add/', {
        product_id: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor
      });
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (err) {
      toast.error('خطا در افزودن به سبد خرید');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return <div>{error || 'محصول یافت نشد'}</div>;
  }

  // تبدیل رشته‌های JSON به آرایه
  const sizes = typeof product.sizes === 'string' ? 
    JSON.parse(product.sizes) : 
    product.sizes || [];
    
  const colors = typeof product.colors === 'string' ? 
    JSON.parse(product.colors) : 
    product.colors || [];

  return (
    <div className={styles.container}>
      <div className={styles.productImage}>
        <img src={mainImage} alt={product.name} />
      </div>
      
      <div className={styles.productInfo}>
        <h1>{product.name}</h1>
        <p className={styles.price}>{product.price} تومان</p>
        
        <div className={styles.options}>
          <div className={styles.sizes}>
            <h3>سایز:</h3>
            <div className={styles.sizeButtons}>
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeButton} ${
                    selectedSize === size ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.colors}>
            <h3>رنگ:</h3>
            <div className={styles.colorButtons}>
              {colors.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorButton} ${
                    selectedColor === color ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.quantity}>
            <h3>تعداد:</h3>
            <div className={styles.quantityControl}>
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
        </div>

        <button 
          className={styles.addToCart}
          onClick={handleAddToCart}
          disabled={!product.stock}
        >
          {product.stock ? 'افزودن به سبد خرید' : 'ناموجود'}
        </button>

        <div className={styles.description}>
          <h3>توضیحات:</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
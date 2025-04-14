// components/ImageUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onImageUpload, maxSize = 10 }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateFile = (file) => {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      'image/tiff',
      'image/heic',
      'image/x-icon'
    ];

    if (!validTypes.includes(file.type)) {
      throw new Error('فرمت فایل پشتیبانی نمی‌شود');
    }

    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`حجم فایل باید کمتر از ${maxSize}MB باشد`);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setError(null);

    if (file) {
      try {
        validateFile(file);
        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        // آپلود تصویر
        const response = await axios.post('/api/upload-image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        onImageUpload(response.data.imageUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="image-input"
      />
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">در حال آپلود...</div>}
    </div>
  );
};

export default ImageUpload;
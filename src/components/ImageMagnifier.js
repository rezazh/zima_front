// src/components/ImageMagnifier.js
import React, { useState, useRef, useEffect } from 'react';
import '../styles/ImageMagnifier.css';

const ImageMagnifier = ({ 
  src, 
  width = '100%', 
  height = '400px',
  magnifierHeight = 150,
  magnifierWidth = 150,
  zoomLevel = 2
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      const { width, height } = img.getBoundingClientRect();
      setSize([width, height]);
    }
  }, [src]);

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();

    // Calculate cursor position on the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div 
      className="image-magnifier-container"
      style={{ 
        position: "relative",
        height: height,
        width: width 
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Product"
        className="main-image"
        style={{
          height: height,
          width: width,
          objectFit: "contain"
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {showMagnifier && (
        <div
          className="magnifier-lens"
          style={{
            position: "absolute",
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifierWidth / 2}px`,
            width: `${magnifierWidth}px`,
            height: `${magnifierHeight}px`,
            backgroundImage: `url('${src}')`,
            backgroundPosition: `
              ${(x * zoomLevel - magnifierWidth / 2) * -1}px 
              ${(y * zoomLevel - magnifierHeight / 2) * -1}px
            `,
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            pointerEvents: "none"
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
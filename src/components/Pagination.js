// src/components/Pagination.js
import React from 'react';
import '../styles/Pagination.css'; // استایل‌های صفحه‌بندی
import { Pagination as MuiPagination } from '@mui/material'; // Import اصلی Pagination

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // اگر فقط یک صفحه یا کمتر وجود دارد، چیزی نمایش نده
  }

  return (
    <div className="pagination-wrapper"> {/* یک div والد برای استایل‌دهی راحت‌تر */}
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange} // onPageChange باید (event, value) را دریافت کند
        color="primary"        shape="rounded"
        // تنظیمات برای نمایش بهتر در موبایل و دسکتاپ
        siblingCount={1} // تعداد صفحات قبل و بعد از صفحه فعلی
        boundaryCount={1} // تعداد صفحات در ابتدا و انتها
        className="custom-pagination" // کلاس برای استایل سفارشی اگر نیاز بود
      />
    </div>
  );
};

export default PaginationComponent; // Export با نام جدید
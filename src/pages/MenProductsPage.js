import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // مطمئن شوید axios نصب است: npm install axios
import {
    Container, Grid, Box, Typography, Breadcrumbs, Link as MuiLink,
    Pagination, CircularProgress, Alert
} from '@mui/material'; // استفاده از کامپوننت‌های Material UI برای Layout
import ProductCard from '../components/ProductCard'; // مسیر صحیح به کامپوننت
import FilterSidebar from '../components/FilterSidebar'; // مسیر صحیح به کامپوننت
import './MenProductsPage.css'; // استایل‌های مخصوص این صفحه
import React, { useState, useEffect, useCallback } from 'react';import axios from 'axios';

// لینک به صفحه اصلی و محصولات کلی (اگر دارید)
import { Link as RouterLink } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // آدرس پایه API

const MenProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOptions, setFilterOptions] = useState({ colors: [], sizes: [], brands: [] });
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
  
    // *** State برای فیلترهای *اعمال شده* ***
    const [appliedFilters, setAppliedFilters] = useState({
      search: '',
      sizes: [],
      colors: [],
      brands: [],    price_min: '',
      price_max: '',
      inStock: false,
      menOnly: true, // یا false بسته به نیاز اولیه
    });

  // --- Fetch Filter Options ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/filter-options/`);
        setFilterOptions({
            colors: response.data.colors || [],
            sizes: response.data.sizes || [],
            brands: response.data.brands || []
        });
      } catch (err) {
        console.error('Error fetching filter options:', err);
        // می‌توانید پیام خطا به کاربر نمایش دهید
      }
    };
    fetchOptions();
  }, []);

  // --- Fetch Products ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    // تبدیل فیلترها به query params معتبر
    const params = {      page: page,
      sort: sortBy,
      ...(filters.search && { search: filters.search }),
      ...(filters.category && { category: filters.category }), // اگر فیلتر دسته‌بندی دارید
      ...(filters.inStock && { in_stock: 'true' }),
      ...(filters.hasDiscount && { has_discount: 'true' }),
      ...(filters.price_min && { price_min: filters.price_min }),
      ...(filters.price_max && { price_max: filters.price_max }),
      ...(filters.colors.length > 0 && { color: filters.colors.join(',') }),
      ...(filters.sizes.length > 0 && { size: filters.sizes.join(',') }),
      ...(filters.brands.length > 0 && { brand: filters.brands.join(',') }),
    };

    try {
      const response = await axios.get(`${API_BASE_URL}/men/`, { params });
      setProducts(response.data.results || []);
      setTotalProducts(response.data.count || 0);
      // محاسبه تعداد صفحات بر اساس پاسخ API (اگر page_size در پاسخ نیست، از مقدار پیش‌فرض استفاده کنید)
      const pageSize = params.page_size || 12; // باید با Pagination بک‌اند هماهنگ باشد
      setTotalPages(Math.ceil((response.data.count || 0) / pageSize));

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.');
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, filters]);

  useEffect(() => {    fetchProducts();
    // اسکرول به بالای صفحه هنگام تغییر فیلتر یا صفحه (اختیاری)
    // window.scrollTo(0, 0);
  }, [fetchProducts]);

  // --- Handlers ---
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => {
        // فقط فیلترهای تغییر کرده را آپدیت کن
        const updatedFilters = { ...prev, ...newFilters };
        // اگر مقدار price خالی شد، آن را از آبجکت حذف کن
        if (updatedFilters.price_min === '') delete updatedFilters.price_min;
        if (updatedFilters.price_max === '') delete updatedFilters.price_max;
        return updatedFilters;
    });
    setPage(1); // ریست صفحه به ۱
  }, []);


  const handleSortChange = (newSortBy) => {
    if (sortBy !== newSortBy) {
        setSortBy(newSortBy);
        setPage(1); // ریست صفحه به ۱
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // دکمه‌های مرتب‌سازی
  const sortButtons = [
      { value: 'newest', label: 'جدیدترین' },
      { value: 'price_asc', label: 'ارزان‌ترین' },
      { value: 'price_desc', label: 'گران‌ترین' },
      { value: 'popular', label: 'محبوب‌ترین' },
  ];

  return (
    <Container maxWidth="xl" className="shop-page-container"> {/* xl برای عرض بیشتر */}
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, mt: 2 }}>
        <MuiLink component={RouterLink} underline="hover" color="inherit" to="/"> خانه </MuiLink>
        {/* <MuiLink component={RouterLink} underline="hover" color="inherit" to="/products"> محصولات </MuiLink> */}
        <Typography color="text.primary">پوشاک مردانه</Typography>      </Breadcrumbs>

      <Grid container spacing={3}> {/* استفاده از Grid برای چیدمان */}
        {/* Sidebar */}
        <Grid item xs={12} md={3} lg={2.5}> {/* عرض سایدبار در اندازه‌های مختلف */}
          <FilterSidebar
            options={filterOptions}
            currentFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9} lg={9.5}>
          {/* Toolbar */}
          <Box className="toolbar">
            <Box className="sort-options">
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>مرتب‌سازی:</Typography>
              {sortButtons.map(button => (
                  <Button
                      key={button.value}
                      size="small"
                      variant={sortBy === button.value ? 'contained' : 'outlined'}
                      onClick={() => handleSortChange(button.value)}
                      className={`sort-button ${sortBy === button.value ? 'active' : ''}`}
                  >
                      {button.label}
                  </Button>
              ))}
            </Box>
            <Typography variant="body2" className="product-count">
              {totalProducts} کالا
            </Typography>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>          )}

          {/* Error State */}
          {!loading && error && (
            <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {products.length > 0 ? (
                <Grid container spacing={2} className="products-grid">
                  {products.map(product => (
                    <Grid item key={product.id} xs={6} sm={4} lg={3} xl={2.4}> {/* تنظیم تعداد کارت در هر ردیف */}
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', p: 5 }}>
                  <Typography color="text.secondary">محصولی با فیلترهای انتخابی یافت نشد.</Typography>
                </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box className="pagination-container">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    // برای نمایش بهتر در موبایل
                    siblingCount={0} // فقط صفحه فعلی و اول/آخر
                    boundaryCount={1} // فقط یک صفحه در ابتدا و انتها
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MenProductsPage;
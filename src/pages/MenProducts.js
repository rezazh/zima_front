// src/pages/MenProducts.js (یا src/components/MenProducts.js)
import React, { useState, useEffect, useCallback } from 'react';import axios from 'axios';
import { Container, Grid, Box, Typography, Breadcrumbs, Link as MuiLink, Pagination as MuiPagination, CircularProgress, Alert, Button, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// مسیرها را بر اساس محل فایل MenProducts.js تنظیم کنید
import FilterSidebar from '../components/FilterSidebar'; // Adjust path if needed
import ProductCard from '../components/ProductCard';     // Adjust path if needed
import '../styles/MenProducts.css'; // Adjust path if needed

const API_BASE_URL = 'http://127.0.0.1:8000/api';const PRODUCTS_PER_PAGE = 12;

const MenProducts = () => {
  const [products, setProducts] = useState([]);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // **مهم:** مقدار اولیه filterOptions باید یک آبجکت باشد تا از خطا جلوگیری شود
  const [filterOptions, setFilterOptions] = useState({ colors: [], sizes: [], brands: [] });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [appliedFilters, setAppliedFilters] = useState({
    search: '', sizes: [], colors: [], brands: [],
    price_min: '', price_max: '', inStock: false, menOnly: true,
  });

  // --- API Call: Fetch Filter Options ---
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter-options/`);
      // **اشکال زدایی:** بررسی داده‌های دریافتی
      console.log("Fetched filter options:", response.data);
      setFilterOptions({
        // حتما مطمئن شوید که API آرایه‌ها را برمی‌گرداند
        sizes: Array.isArray(response.data.sizes) ? response.data.sizes : [],
        colors: Array.isArray(response.data.colors) ? response.data.colors : [],
        brands: Array.isArray(response.data.brands) ? response.data.brands : [],
      });
    } catch (err) {
      console.error('Error fetching filter options:', err);
      setError('خطا در دریافت گزینه‌های فیلتر.');
    }
  }, []);

  // --- API Call: Fetch Products based on Applied Filters ---
  const fetchProducts = useCallback(async () => {
    // ... (کد fetchProducts بدون تغییر باقی می‌ماند - همان کد پاسخ قبلی) ...
    setLoading(true);
    setError(null);
    const params = { /* ... پارامترها بر اساس appliedFilters ... */        page: currentPage,
        page_size: PRODUCTS_PER_PAGE,
        sort: sortBy,
        ...(appliedFilters.search && { search: appliedFilters.search }),
        ...(appliedFilters.inStock && { in_stock: 'true' }),
        ...(appliedFilters.menOnly && { /* پارامتر مربوط به مردانه در بک‌اند */ }),
        ...(appliedFilters.price_min && { price_min: appliedFilters.price_min }),
        ...(appliedFilters.price_max && { price_max: appliedFilters.price_max }),
        ...(appliedFilters.colors.length > 0 && { color: appliedFilters.colors.join(',') }),        ...(appliedFilters.sizes.length > 0 && { size: appliedFilters.sizes.join(',') }),
        ...(appliedFilters.brands.length > 0 && { brand: appliedFilters.brands.join(',') }),    };
    console.log("Fetching products with params:", params);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/men/`, { params });
      setProducts(response.data.results || []);
      const count = response.data.count || 0;
      setTotalProducts(count);
      const receivedPageSize = response.data.page_size || PRODUCTS_PER_PAGE;
      setTotalPages(Math.ceil(count / receivedPageSize));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.');
      setProducts([]); setTotalProducts(0); setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, appliedFilters]);

  // --- Effects ---
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProducts]);

  // --- Handlers ---
  const handleApplyFilters = useCallback((newFiltersFromSidebar) => {
    setAppliedFilters(newFiltersFromSidebar);
    setCurrentPage(1);
  }, []);  const handleSortChange = (newSortBy) => {
    // ... (بدون تغییر) ...
    if (sortBy !== newSortBy) {
        setSortBy(newSortBy);
        setCurrentPage(1);
    }  };

  const handlePageChange = (event, value) => {
    // ... (بدون تغییر) ...
    setCurrentPage(value);
  };

  const sortButtons = [ /* ... (بدون تغییر) ... */
    { value: 'newest', label: 'جدیدترین' },    { value: 'popular', label: 'محبوب‌ترین' },
    { value: 'price_asc', label: 'ارزان‌ترین' },
    { value: 'price_desc', label: 'گران‌ترین' },
];

  // --- Render ---
  return (
    // **مهم:** استفاده از Container برای مدیریت عرض کلی صفحه
    <Container maxWidth="xl" className="shop-page-container">
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, mt: 2 }}>
        <MuiLink component={RouterLink} underline="hover" color="inherit" to="/"> خانه </MuiLink>        <Typography color="text.primary">پوشاک مردانه</Typography>
      </Breadcrumbs>

      {/* **مهم:** استفاده از Grid container برای ستون‌بندی */}
      <Grid container spacing={3}>
        {/* ستون سایدبار فیلتر */}
        {/* **مهم:** تعیین عرض ستون برای اندازه‌های مختلف صفحه */}
        <Grid item xs={12} sm={4} md={3} lg={2.5}>
          <FilterSidebar
            // **مهم:** پاس دادن filterOptions به prop options
            options={filterOptions}
            initialFilters={appliedFilters}
            onApplyFilters={handleApplyFilters}          />
        </Grid>

        {/* ستون محتوای اصلی */}
        {/* **مهم:** تعیین عرض ستون برای گرفتن فضای باقی‌مانده */}
        <Grid item xs={12} sm={8} md={9} lg={9.5}>
          {/* Toolbar */}
          <Box className="toolbar">
            {/* ... (کد Toolbar بدون تغییر) ... */}
            <Box className="sort-options">
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary', whiteSpace: 'nowrap' }}>مرتب‌سازی:</Typography>
                {sortButtons.map(button => ( <Button key={button.value} size="small" variant={sortBy === button.value ? 'contained' : 'outlined'} onClick={() => handleSortChange(button.value)} className={`sort-button ${sortBy === button.value ? 'active' : ''}`} > {button.label} </Button> ))}
            </Box>
            <Typography variant="body2" className="product-count"> {totalProducts} کالا </Typography>
          </Box>          {/* Loading Indicator */}
          {loading && ( /* ... (کد Skeleton بدون تغییر) ... */
            <Grid container spacing={2} sx={{ mt: 1 }}> {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => ( <Grid item key={`skeleton-${index}`} xs={6} sm={4} lg={3} xl={2.4}> <Skeleton variant="rectangular" height={180} animation="wave" /> <Skeleton variant="text" width="80%" animation="wave" sx={{ mt: 1 }}/> <Skeleton variant="text" width="40%" animation="wave" /> </Grid> ))} </Grid>
          )}

          {/* Error Message */}
          {!loading && error && ( /* ... (کد Alert بدون تغییر) ... */            <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
          )}

          {/* Products Grid & Pagination */}
          {!loading && !error && (
            <>
              {products.length > 0 ? (
                <Grid container spacing={2} className="products-grid">
                  {/* ... (map روی products و رندر ProductCard بدون تغییر) ... */
                    products.map(product => ( <Grid item key={product.id} xs={6} sm={4} lg={3} xl={2.4}> <ProductCard product={product} /> </Grid> ))
                  }
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', p: 5, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <Typography color="text.secondary">محصولی با فیلترهای انتخابی یافت نشد.</Typography> </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && ( /* ... (کد Pagination بدون تغییر) ... */                <Box className="pagination-container"> <MuiPagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" siblingCount={1} boundaryCount={1} /> </Box>
              )}
            </>
          )}
        </Grid> {/* End Main Content Column */}
      </Grid> {/* End Main Grid Container */}
    </Container> // End Page Container
  );
};

export default MenProducts;
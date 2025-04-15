import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Grid, Box, Typography, Button, Alert, Breadcrumbs, Link as MuiLink, Pagination as MuiPagination, Skeleton, Paper, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; // Import components used
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icon for back-to-top
// *** IMPORT FROM PLACEHOLDER FILE ***
import { getMenProducts, getFilterOptions, getCategories } from '../services/apiService_placeholder'; // Ensure this path is correct
import FilterSidebar from '../components/FilterSidebar'; // Ensure this path is correct
import ProductCard from '../components/ProductCard'; // Ensure this path is correct
import '../styles/MenProducts.css'; // <--- استفاده از فایل CSS شما

const PRODUCTS_PER_PAGE = 16; // تعداد محصولات در هر صفحه

const sortOptions = [
    { label: 'جدیدترین', value: 'newest' },
    { label: 'پربازدیدترین', value: 'most_visited' },
    { label: 'ارزان‌ترین', value: 'price_asc' },
    { label: 'گران‌ترین', value: 'price_desc' }
];

const defaultFiltersState = {
    brands: [], colors: [], sizes: [], features: [], price_min: '', price_max: '',};

const MenProducts = () => {
    // --- State (مانند قبل) ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ colors: [], sizes: [], brands: [], features: [] });
    const [appliedFilters, setAppliedFilters] = useState(defaultFiltersState);
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showScroll, setShowScroll] = useState(false); // State for back-to-top button

    // --- Hooks (مانند قبل) ---
    const location = useLocation();
    const navigate = useNavigate();
    const { categoryId } = useParams();

    // --- Functions (parseQueryParams, updateQueryParams - مانند قبل) ---
    // Function to parse query params for filters, sort, page
    const parseQueryParams = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const filters = { ...defaultFiltersState };
        filters.brands = params.getAll('brand');        filters.colors = params.getAll('color');
        filters.sizes = params.getAll('size');
        filters.features = params.getAll('feature');
        filters.price_min = params.get('price_min') || '';
        filters.price_max = params.get('price_max') || '';
        const currentPageFromUrl = parseInt(params.get('page') || '1', 10);
        const currentSortByFromUrl = params.get('sortBy') || 'newest';
        setAppliedFilters(filters);
        setSortBy(currentSortByFromUrl);
        setCurrentPage(currentPageFromUrl);
        return { filters, sortBy: currentSortByFromUrl, page: currentPageFromUrl };
    }, [location.search]);

    // Function to update URL query params
    const updateQueryParams = useCallback((newFilters, newSortBy, newPage) => {
        const params = new URLSearchParams();
        newFilters.brands?.forEach(b => params.append('brand', b));
        newFilters.colors?.forEach(c => params.append('color', c));
        newFilters.sizes?.forEach(s => params.append('size', s));        newFilters.features?.forEach(f => params.append('feature', f));
        if (newFilters.price_min) params.set('price_min', newFilters.price_min);
        if (newFilters.price_max) params.set('price_max', newFilters.price_max);        if (newSortBy && newSortBy !== 'newest') params.set('sortBy', newSortBy);
        if (newPage && newPage > 1) params.set('page', newPage);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [navigate, location.pathname]);

    // --- Effects ---
    // Fetch categories and filter options once on mount (مانند قبل)
    useEffect(() => {
        let isMounted = true;
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [cats, options] = await Promise.all([
                    getCategories(),
                    getFilterOptions(categoryId || 'men')
                ]);
                if (isMounted) {
                    setCategories(cats || []);
                    setFilterOptions(options || { colors: [], sizes: [], brands: [], features: [] });
                }
            } catch (err) {
                console.error("Failed fetch initial data:", err);
                if (isMounted) setError("خطا در دریافت اطلاعات اولیه.");
            }
        };
        fetchInitialData();
        return () => { isMounted = false; };
    }, [categoryId]);

    // Fetch products when URL query string or categoryId changes (مانند قبل)
    useEffect(() => {
        let isMounted = true;
        if (!categories.length && !filterOptions.colors.length && !filterOptions.brands.length) {             // If initial data isn't loaded, don't fetch products yet
             // Keep loading as true until initial data OR products are fetched
             setLoading(true);
             return;
        }

        const { filters, sortBy: currentSortBy, page } = parseQueryParams();
        const fetchProducts = async () => {            // Ensure loading is true *before* async call
            if(isMounted) setLoading(true);            setError(null);
            try {
                const apiParams = { ...filters, page, limit: PRODUCTS_PER_PAGE, sortBy: currentSortBy, category: categoryId };
                const response = await getMenProducts(apiParams);
                if (isMounted) {
                    if (response?.data) {
                        setProducts(response.data);
                        setTotalPages(response.totalPages);
                        setTotalProducts(response.totalItems);
                    } else { throw new Error("ساختار پاسخ محصولات نامعتبر است."); }
                }
            } catch (err) {
                console.error("Failed fetch products:", err);
                if (isMounted) {
                    setError(err.message || "خطا در دریافت محصولات.");
                    setProducts([]); setTotalPages(1); setTotalProducts(0);
                }
            } finally {
                // Set loading false only if the component is still mounted
                 if (isMounted) setLoading(false);
            }
        };
        fetchProducts();
        return () => { isMounted = false; };
    }, [location.search, categoryId, categories, filterOptions, parseQueryParams]);

    // Effect for back-to-top button visibility
    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScroll && window.pageYOffset > 400){
                setShowScroll(true);            } else if (showScroll && window.pageYOffset <= 400){
                setShowScroll(false);
            }
        };        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScroll]);


    // --- Handlers (handleApplyFilters, handleSortChange, handlePageChange - مانند قبل) ---
     const handleApplyFilters = useCallback((newFilters) => {
        updateQueryParams(newFilters, sortBy, 1);
    }, [sortBy, updateQueryParams]);

    const handleSortChange = useCallback((event) => {
        const newSortValue = event.target.value;
        updateQueryParams(appliedFilters, newSortValue, 1);
    }, [appliedFilters, updateQueryParams]);

    const handlePageChange = useCallback((event, newPage) => {
        updateQueryParams(appliedFilters, sortBy, newPage);
        // window.scrollTo({ top: 0, behavior: 'smooth' }); // CSS handles smooth scroll now potentially
        window.scrollTo(0, 0); // Instant scroll
    }, [appliedFilters, sortBy, updateQueryParams]);    const scrollTop = () =>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    // --- Memos (sidebarOptions, sidebarCategories, currentCategoryName - مانند قبل) ---
    const sidebarOptions = useMemo(() => filterOptions, [filterOptions]);
    const sidebarCategories = useMemo(() => categories, [categories]);
    const currentCategoryName = useMemo(() => {
        const findCategoryName = (cats, id) => {
            for (const cat of cats) {
                if (cat.id === id) return cat.name;
                if (cat.children) {
                    const found = findCategoryName(cat.children, id);
                    if (found) return found;
                }
            } return null;
        };
        return categoryId ? findCategoryName(categories, categoryId) : "پوشاک مردانه";
    }, [categories, categoryId]);

    // --- Render ---
    return (
        // Apply the main container class from your CSS
        <Container maxWidth={false} className="shop-page-container">
            {/* Breadcrumbs */}
            <Box className="breadcrumb-container"> {/* Use class from CSS */}
                 <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: 'inherit' }}>
                    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                        خانه
                    </MuiLink>
                    {/* Add logic here if you have nested categories */}
                    <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>{currentCategoryName || 'محصولات'}</Typography>
                </Breadcrumbs>
            </Box>

            {/* Main Layout Container */}
            <Box className="page-content-container"> {/* Use class from CSS */}

                {/* Filter Sidebar Column */}
                <Box className="filters-column"> {/* Use class from CSS */}
                    {/* No Paper needed if CSS provides background/border */}
                    <FilterSidebar
                        categories={sidebarCategories}
                        options={sidebarOptions}
                        initialFilters={appliedFilters}
                        onApplyFilters={handleApplyFilters}
                        isLoading={loading && (!categories.length || !filterOptions.colors.length)} // More accurate loading
                    />
                </Box>

                {/* Main Content Column */}
                <Box className="main-content-column"> {/* Use class from CSS */}
                    {/* Toolbar */}
                    <Box className="toolbar"> {/* Use class from CSS */}
                         {/* Product Count */}
                         <Typography className="product-count">
                             {loading ? 'درحال بارگذاری...' : `${totalProducts} کالا`}
                         </Typography>
                         {/* Sort Select Dropdown */}
                         <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                             <InputLabel id="sort-by-label" sx={{fontSize: '0.9rem', lineHeight: 1.4}}>مرتب سازی</InputLabel>
                             <Select
                                 labelId="sort-by-label"
                                 id="sort-by-select"
                                 value={sortBy}
                                 label="مرتب سازی"
                                 onChange={handleSortChange}
                                 variant="outlined"
                                 sx={{fontSize: '0.9rem'}}
                             >
                                 {sortOptions.map(option => (
                                     <MenuItem key={option.value} value={option.value} sx={{fontSize: '0.9rem'}}>
                                         {option.label}
                                     </MenuItem>
                                 ))}
                             </Select>
                         </FormControl>
                    </Box>

                    {/* Content Area */}
                    {error && (
                        // Use your CSS class for error message
                        <Alert severity="error" className="error-message">{error}</Alert>
                    )}

                    {/* Use div with class instead of MUI Grid container for products */}
                    <Box className="products-grid">
                         {loading && (
                             Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                                 // Use Skeleton within a div structure matching your card
                                 <Box key={`skeleton-${index}`} className="product-card-skeleton">
                                     <Skeleton variant="rectangular" height={180} />
                                     <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                                     <Skeleton variant="text" width="40%" />
                                     <Skeleton variant="text" width="60%" sx={{ mt: 0.5 }}/>
                                 </Box>
                             ))
                         )}

                        {!loading && !error && products.length === 0 && (
                            // Use your CSS class for no products found
                            <Box className="no-products-found">
                                محصولی با این فیلترها یافت نشد.
                            </Box>
                        )}

                        {!loading && !error && products.length > 0 && (
                            products.map((product) => (
                                product && product.id ? (
                                    // Render ProductCard directly
                                    <ProductCard key={product.id} product={product} />
                                ) : null                            ))
                        )}
                    </Box> {/* End products-grid */}

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, mt: 2 }}>
                            <MuiPagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                    )}
                </Box> {/* End Main Content Column */}
            </Box> {/* End Page Content Container */}

            {/* Back to Top Button */}
            <IconButton
                 onClick={scrollTop}
                 className={`back-to-top ${showScroll ? 'visible' : ''}`} // Use classes from CSS
                 aria-label="scroll back to top"
            >
                <ArrowUpwardIcon />
            </IconButton>

        </Container> // End shop-page-container
    );};

export default MenProducts;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Box, Typography, Alert, Breadcrumbs, Link as MuiLink, Pagination as MuiPagination, Skeleton, Paper, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; // Removed Button, Grid as we use CSS grid
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// *** IMPORT FROM REAL API SERVICE ***
import { getMenProducts, getFilterOptions, getCategories } from '../services/apiService'; // Use real service
import FilterSidebar from '../components/FilterSidebar'; // Path to FilterSidebar
import ProductCard from '../components/ProductCard';     // Path to ProductCard
import '../styles/MenProducts.css'; // Your specific CSS file for this page

// Backend controls page size, so this is mainly for skeleton count
const SKELETON_COUNT = 12;

const sortOptions = [
    { label: 'جدیدترین', value: 'newest' },
    { label: 'پربازدیدترین', value: 'most_visited' },
    { label: 'ارزان‌ترین', value: 'price_asc' },
    { label: 'گران‌ترین', value: 'price_desc' }
];

const defaultFiltersState = {
    brands: [], colors: [], sizes: [], features: [], price_min: '', price_max: '', search: ''
};

const MenProducts = () => {
    // --- State ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Combined loading state
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ colors: [], sizes: [], brands: [], features: [] });
    const [appliedFilters, setAppliedFilters] = useState(defaultFiltersState);    const [sortBy, setSortBy] = useState('newest');    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showScroll, setShowScroll] = useState(false);

    // --- Hooks ---
    const location = useLocation();
    const navigate = useNavigate();
    const { categoryId } = useParams();

    // --- Functions ---
    // Parse query params from URL search string
    const parseQueryParams = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const filters = { ...defaultFiltersState };
        filters.brands = params.getAll('brand');
        filters.colors = params.getAll('color'); // Expecting color names now
        filters.sizes = params.getAll('size');
        filters.features = params.getAll('feature');
        filters.price_min = params.get('price_min') || '';
        filters.price_max = params.get('price_max') || '';
        filters.search = params.get('search') || '';

        const currentPageFromUrl = parseInt(params.get('page') || '1', 10);
        const currentSortByFromUrl = params.get('sortBy') || 'newest';

        // Update state directly based on URL
        setAppliedFilters(filters);
        setSortBy(currentSortByFromUrl);
        setCurrentPage(currentPageFromUrl);

        return { filters, sortBy: currentSortByFromUrl, page: currentPageFromUrl };
    }, [location.search]);

    // Update URL query params based on new filters, sort, page
    const updateQueryParams = useCallback((newFilters, newSortBy, newPage) => {
        const params = new URLSearchParams();
        newFilters.brands?.forEach(b => params.append('brand', b));
        newFilters.colors?.forEach(c => params.append('color', c)); // Send color names
        newFilters.sizes?.forEach(s => params.append('size', s));
        newFilters.features?.forEach(f => params.append('feature', f));
        if (newFilters.price_min) params.set('price_min', newFilters.price_min);
        if (newFilters.price_max) params.set('price_max', newFilters.price_max);
        if (newFilters.search) params.set('search', newFilters.search);
        if (newSortBy && newSortBy !== 'newest') params.set('sortBy', newSortBy);
        if (newPage && newPage > 1) params.set('page', newPage);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });    }, [navigate, location.pathname]);

    // --- Effects ---
    // Fetch initial categories and filter options
    useEffect(() => {
        let isMounted = true;
        const fetchInitialData = async () => {
            if (isMounted) setLoading(true); // Start loading
            setError(null);
            try {
                const [catsData, optionsData] = await Promise.all([
                    getCategories(),
                    getFilterOptions(categoryId || 'men')
                ]);
                if (isMounted) {
                    setCategories(catsData || []);
                    setFilterOptions(optionsData || { colors: [], sizes: [], brands: [], features: [] });
                }
            } catch (err) {
                console.error("Failed fetch initial data:", err);
                if (isMounted) setError(err.message || "خطا در دریافت اطلاعات اولیه.");
            } finally {
                // Don't set loading false here yet
            }
        };
        fetchInitialData();
        return () => { isMounted = false; };
    }, [categoryId]);

    // Fetch products whenever URL (location.search) changes
    useEffect(() => {
        let isMounted = true;
        const { filters, sortBy: currentSortBy, page } = parseQueryParams(); // Get state from URL

        const fetchProducts = async () => {
            if(isMounted) setLoading(true); // Ensure loading is true before async call
            setError(null); // Clear previous errors

            try {
                const apiParams = { ...filters, page, sortBy: currentSortBy };
                const response = await getMenProducts(apiParams); // Call real API
                if (isMounted) {
                    setProducts(response.data);
                    setTotalPages(response.totalPages);
                    setTotalProducts(response.totalItems);
                }
            } catch (err) {
                console.error("Failed fetch products:", err);
                if (isMounted) {
                    setError(err.message || "خطا در دریافت محصولات.");
                    setProducts([]); setTotalPages(1); setTotalProducts(0);
                }
            } finally {
                 if (isMounted) setLoading(false); // Set loading false after fetch attempt
            }
        };

        fetchProducts(); // Fetch immediately when dependencies change

        return () => { isMounted = false; };
    }, [location.search, categoryId, parseQueryParams]); // Removed filterOptions dependency for simplicity, rely on URL change

    // Effect for back-to-top button visibility
    useEffect(() => {
        const checkScrollTop = () => {
            setShowScroll(window.pageYOffset > 400);
        };
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, []);

    // --- Handlers ---
    const handleApplyFilters = useCallback((newFilters) => {
        updateQueryParams(newFilters, sortBy, 1); // Reset page to 1
    }, [sortBy, updateQueryParams]);

    const handleSortChange = useCallback((event) => {
        updateQueryParams(appliedFilters, event.target.value, 1); // Reset page to 1
    }, [appliedFilters, updateQueryParams]);

    const handlePageChange = useCallback((event, newPage) => {
        updateQueryParams(appliedFilters, sortBy, newPage);
        window.scrollTo(0, 0); // Scroll to top
    }, [appliedFilters, sortBy, updateQueryParams]);    const scrollTop = useCallback(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);

    // --- Memos ---
    const sidebarOptions = useMemo(() => filterOptions, [filterOptions]);
    const sidebarCategories = useMemo(() => categories, [categories]);
    const currentCategoryName = useMemo(() => {
        const findCategoryName = (cats, id) => {
             if (!cats || !id) return null;
             for (const cat of cats) {
                 if (cat.id?.toString() === id.toString()) return cat.name; // Compare as strings just in case
                 if (cat.children) { const found = findCategoryName(cat.children, id); if (found) return found; }
             } return null;
         };
         return categoryId ? findCategoryName(categories, categoryId) : "پوشاک مردانه";
     }, [categories, categoryId]);


    // --- Render ---
    return (
        <Container maxWidth={false} className="shop-page-container">
            <Box className="breadcrumb-container">
                 <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: 'inherit' }}>
                    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                        خانه
                    </MuiLink>
                    <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>{currentCategoryName || 'محصولات'}</Typography>
                </Breadcrumbs>
            </Box>

            <Box className="page-content-container">
                {/* Filters Column */}
                <Box className="filters-column">
                    <FilterSidebar
                        categories={sidebarCategories}
                        options={sidebarOptions}
                        initialFilters={appliedFilters}
                        onApplyFilters={handleApplyFilters}                        isLoading={loading && (!categories.length || !filterOptions.colors.length)} // Loading if fetching initial data
                    />
                </Box>

                {/* Main Content Column */}                <Box className="main-content-column">
                    {/* Toolbar */}
                    <Box className="toolbar">
                        <Typography className="product-count">
                             {/* Show loading placeholder only if products haven't loaded yet */}
                             {loading && products.length === 0 ? 'درحال بارگذاری...' : `${totalProducts} کالا`}
                        </Typography>
                        <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                             <InputLabel id="sort-by-label" sx={{fontSize: '0.9rem', lineHeight: 1.4}}>مرتب سازی</InputLabel>
                             <Select
                                 labelId="sort-by-label" id="sort-by-select" value={sortBy}
                                 label="مرتب سازی" onChange={handleSortChange} variant="outlined"
                                 sx={{fontSize: '0.9rem'}}
                             >                                 {sortOptions.map(option => (
                                     <MenuItem key={option.value} value={option.value} sx={{fontSize: '0.9rem'}}>
                                         {option.label}
                                     </MenuItem>
                                 ))}
                             </Select>
                         </FormControl>
                    </Box>

                    {/* Error Display */}
                    {error && !loading && ( // Show error only if not loading
                        <Alert severity="error" className="error-message">{error}</Alert>
                    )}

                    {/* Products Grid / Skeletons / No Results */}
                    <Box className="products-grid">
                         {loading && ( // Show skeletons ONLY when loading
                             Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                                 <Box key={`skeleton-${index}`} className="product-card-skeleton">
                                     <Skeleton variant="rectangular" height={180} animation="wave" />
                                     <Skeleton variant="text" animation="wave" sx={{ mt: 1 }} />
                                     <Skeleton variant="text" width="60%" animation="wave" />
                                     <Skeleton variant="text" width="80%" animation="wave" sx={{ mt: 0.5 }}/>
                                 </Box>
                             ))
                         )}

                        {!loading && !error && products.length === 0 && ( // Show no results only if not loading and no error
                            <Box className="no-products-found">
                                محصولی با این فیلترها یافت نشد.
                            </Box>
                        )}

                        {!loading && !error && products.length > 0 && ( // Show products only if not loading, no error, and products exist
                            products.map((product) => (
                                product && product.id ? (
                                    <ProductCard key={product.id} product={product} />
                                ) : null
                            ))
                        )}
                    </Box>

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && ( // Show pagination only if not loading, no error, and multiple pages
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, mt: 2 }}>
                            <MuiPagination
                                count={totalPages} page={currentPage} onChange={handlePageChange}
                                color="primary" shape="rounded"                                // Boundary/sibling count can be adjusted for better UX
                                siblingCount={1}
                                boundaryCount={1}
                            />
                        </Box>
                    )}                </Box>
            </Box>

            {/* Back to Top Button */}
            <IconButton onClick={scrollTop} className={`back-to-top ${showScroll ? 'visible' : ''}`} aria-label="scroll back to top">
                <ArrowUpwardIcon />
            </IconButton>

        </Container>
    );
};

export default MenProducts;
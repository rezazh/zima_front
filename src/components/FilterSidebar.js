import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button,
    Skeleton, Divider, Accordion, AccordionSummary, AccordionDetails, List,
    ListItemButton, ListItemText, Collapse, IconButton, Tooltip // Ensure Tooltip is imported
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link as RouterLink, useParams } from 'react-router-dom';
// import '../styles/FilterSidebar.css'; // Import specific CSS if you have one

// --- Helper Components ---

// Recursive Category List Item Component
const CategoryListItem = ({ category, level = 0, currentCategoryId }) => {
    const [open, setOpen] = useState(false); // State for expanding children
    // Ensure category and category.id exist before accessing properties
    const hasChildren = category?.children && category.children.length > 0;
    // Compare IDs safely, converting to string if necessary
    const isActive = category?.id?.toString() === currentCategoryId?.toString();

    const handleClick = (event) => {
        if (hasChildren) {            event.preventDefault(); // Prevent navigation, just toggle
            setOpen(!open);
        }
        // Navigation is handled by the Link component itself
    };

    // Return null or a placeholder if category is invalid
    if (!category || !category.id) {
        console.warn("Invalid category data passed to CategoryListItem:", category);
        return null;
    }

    return (
        <>
            <ListItemButton
                component={RouterLink}
                to={`/category/${category.id}`} // Ensure your app's routes match this pattern
                sx={{
                    pl: 2 + level * 2, // Indentation based on level
                    backgroundColor: isActive ? 'action.selected' : 'transparent',
                    borderRight: isActive ? '3px solid' : 'none',
                    borderRightColor: 'primary.main',
                    py: 0.5, // Adjust vertical padding
                    '&:hover': { backgroundColor: 'action.hover' }
                 }}
                onClick={handleClick}
                selected={isActive}
                dense // Make items less tall
            >
                <ListItemText primary={category.name || 'بدون نام'} sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', fontWeight: isActive ? 500 : 400 } }}/>
                {hasChildren ? (open ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />) : null}
            </ListItemButton>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {category.children.map((child) => (
                            // Ensure child is valid before rendering recursively
                            child && child.id ? <CategoryListItem key={child.id} category={child} level={level + 1} currentCategoryId={currentCategoryId}/> : null
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};// --- Main Filter Sidebar Component ---
const FilterSidebar = ({ categories = [], options, initialFilters, onApplyFilters, isLoading = false }) => {
    // --- State ---
    // Define default structure clearly
    const defaultFiltersState = useMemo(() => ({
        brands: [], colors: [], sizes: [], features: [], price_min: '', price_max: '', search: ''    }), []);

    // Initialize local state from initialFilters or default
    const [localFilters, setLocalFilters] = useState(() => ({
        ...defaultFiltersState,
        ...(initialFilters || {}),
        // Ensure array fields are arrays
        brands: initialFilters?.brands || [],
        colors: initialFilters?.colors || [],
        sizes: initialFilters?.sizes || [],
        features: initialFilters?.features || [],    }));

    const [brandSearch, setBrandSearch] = useState('');
    // Default expanded accordions
    const [expandedAccordions, setExpandedAccordions] = useState({
        price: true, brand: true, color: true, feature: false, size: false,
    });

    const { categoryId: currentCategoryId } = useParams(); // Get current category ID from URL

    // Sync local state when initialFilters (from URL) change
    useEffect(() => {
        setLocalFilters({
            ...defaultFiltersState,
            ...(initialFilters || {}),
            brands: initialFilters?.brands || [],
            colors: initialFilters?.colors || [],
            sizes: initialFilters?.sizes || [],
            features: initialFilters?.features || [],
        });
    }, [initialFilters, defaultFiltersState]);

    // --- Handlers ---
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordions(prev => ({ ...prev, [panel]: isExpanded }));
    };

    // Generic handler for checkbox groups (brands, colors, sizes, features)
    const handleCheckboxChange = (groupName, value) => {
        setLocalFilters(prev => {
            const currentGroup = prev[groupName] || [];
            const newGroup = currentGroup.includes(value)
                ? currentGroup.filter(item => item !== value) // Remove if exists
                : [...currentGroup, value]; // Add if not exists
            return { ...prev, [groupName]: newGroup };
        });
    };

    // Handler for price input changes
    const handlePriceChange = useCallback((event) => {
        const { name, value } = event.target;
        // Allow empty string, otherwise only keep digits
        const numericValue = value === '' ? '' : value.replace(/[^0-9]/g, '');
        setLocalFilters(prev => ({ ...prev, [name]: numericValue }));
    }, []);

    // Handler for search input (if used within sidebar)
    const handleSearchChange = useCallback((event) => {
        setLocalFilters(prev => ({ ...prev, search: event.target.value }));
    }, []);

    // Handler for Apply button click
    const handleApplyClick = useCallback(() => {
        onApplyFilters(localFilters); // Pass the current local state to parent
    }, [localFilters, onApplyFilters]);

    // Handler for Clear Filters button click
    const clearLocalFilters = useCallback(() => {
        setLocalFilters(defaultFiltersState); // Reset local state
        setBrandSearch(''); // Reset brand search term
        onApplyFilters(defaultFiltersState); // Apply cleared filters to parent
    }, [onApplyFilters, defaultFiltersState]);

    // --- Memoized values ---
    // Filter brands based on search term
    const filteredBrands = useMemo(() => {
        const brandOptions = options?.brands || [];
        if (!brandSearch) return brandOptions;
        const searchLower = brandSearch.toLowerCase();
        return brandOptions.filter(brand => brand.toLowerCase().includes(searchLower));
    }, [options?.brands, brandSearch]);

    // --- Render ---
    // Ensure options and localFilters are defined before accessing properties
    const safeOptions = options || { colors: [], sizes: [], brands: [], features: [] };
    const safeLocalFilters = localFilters || defaultFiltersState;

    // Helper function to render Filter Accordions
    const renderFilterAccordion = (id, title, content) => (
         <Accordion
            disableGutters elevation={0} square
            sx={{ borderBottom: 1, borderColor: 'divider', '&:before': { display: 'none' }, bgcolor: 'transparent' }}
            expanded={!!expandedAccordions[id]} // Use !! to ensure boolean
            onChange={handleAccordionChange(id)}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: '40px', '& .MuiAccordionSummary-content': { my: '8px' } }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
                {/* Show skeleton only if loading AND content depends on options */}
                 {isLoading && ['brand', 'color', 'size', 'feature'].includes(id) ? <Skeleton height={60} animation="wave"/> : content}
            </AccordionDetails>
        </Accordion>
    );    return (
        // Main container Box for the sidebar content
        // className can be applied from parent or here if needed
        <Box className="filter-sidebar-content">
            {/* Categories Section */}
            <Box mb={2}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: '1.0rem', px: 1 }}>
                    دسته‌بندی‌ها
                </Typography>
                {/* Show skeletons if loading */}
                {isLoading && (!categories || categories.length === 0) && (
                    <> <Skeleton animation="wave" height={30}/> <Skeleton animation="wave" width="80%" height={30}/> <Skeleton animation="wave" width="60%" height={30}/> </>
                )}
                {/* Show categories list if not loading and categories exist */}
                {!isLoading && categories && categories.length > 0 && (
                    <List dense component="nav" sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
                        {categories.map(cat => (
                            // Render CategoryListItem only if cat is valid
                             cat && cat.id ? <CategoryListItem key={cat.id} category={cat} currentCategoryId={currentCategoryId}/> : null
                        ))}
                    </List>                )}
                {/* Show message if not loading and no categories */}
                {!isLoading && (!categories || categories.length === 0) && (
                    <Typography variant="body2" color="text.secondary" sx={{px: 1}}>دسته بندی یافت نشد.</Typography>
                )}
            </Box>

            <Divider sx={{ my: 1 }} />

            <Typography variant="h6" sx={{ mb: 0, fontWeight: 600, fontSize: '1.0rem', px: 1 }}>
                فیلترها            </Typography>

            {/* Price Filter */}
            {renderFilterAccordion('price', 'محدوده قیمت', (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                     <TextField label="از" variant="outlined" size="small" name="price_min" value={safeLocalFilters.price_min || ''} onChange={handlePriceChange} InputProps={{ inputMode: 'numeric' }} sx={{ textAlign: 'center', '& input': {textAlign: 'center', p: '8.5px 5px'}, fontSize: '0.8rem' }} />
                     <Typography sx={{color: 'text.secondary'}}>-</Typography>
                     <TextField label="تا" variant="outlined" size="small" name="price_max" value={safeLocalFilters.price_max || ''} onChange={handlePriceChange} InputProps={{ inputMode: 'numeric' }} sx={{ textAlign: 'center', '& input': {textAlign: 'center', p: '8.5px 5px'}, fontSize: '0.8rem' }} />
                 </Box>
            ))}

            {/* Brand Filter */}
            {renderFilterAccordion('brand', 'برند', (
                <>
                    <TextField
                        fullWidth variant="outlined" size="small" placeholder="جستجوی برند..."
                        value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)}
                        InputProps={{ endAdornment: <IconButton size="small"><SearchIcon fontSize="small" /></IconButton>, sx:{pr: 0.5} }} sx={{ mb: 1 }}
                    />
                    <FormGroup sx={{ maxHeight: 180, overflowY: 'auto', pr: 1, ml: -1 }}>
                        {filteredBrands.map(brand => (
                            <FormControlLabel
                                key={brand}
                                control={<Checkbox checked={safeLocalFilters.brands?.includes(brand) || false} onChange={() => handleCheckboxChange('brands', brand)} size="small" sx={{py: 0.2}} />}
                                label={brand} sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                            />                        ))}
                         {filteredBrands.length === 0 && !isLoading && <Typography variant="body2" color="text.secondary" sx={{p:1}}>برندی یافت نشد.</Typography>}
                    </FormGroup>
                </>
            ))}

            {/* Color Filter (Using Checkboxes for Names) */}
            {renderFilterAccordion('color', 'رنگ', (
                 <FormGroup sx={{ maxHeight: 180, overflowY: 'auto', pr: 1, ml: -1 }}>
                    {(safeOptions.colors || []).map(colorName => (
                        <FormControlLabel
                            key={colorName}
                            control={<Checkbox checked={safeLocalFilters.colors?.includes(colorName) || false} onChange={() => handleCheckboxChange('colors', colorName)} size="small" sx={{ py: 0.2 }} />}
                            label={colorName} sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                        />
                    ))}
                     {(safeOptions.colors || []).length === 0 && !isLoading && <Typography variant="body2" color="text.secondary" sx={{p:1}}>رنگی یافت نشد.</Typography>}
                 </FormGroup>
            ))}

             {/* Features Filter */}
            {renderFilterAccordion('feature', 'ویژگی‌ها', (
                <FormGroup sx={{ml: -1}}>
                    {(safeOptions.features || []).map(feature => (
                        <FormControlLabel
                            key={feature.id}
                            control={<Checkbox checked={safeLocalFilters.features?.includes(feature.id) || false} onChange={() => handleCheckboxChange('features', feature.id)} size="small" sx={{py: 0.2}} />}
                            label={feature.label} sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                        />
                    ))}
                     {/* Add message if no features defined */}
                    {(safeOptions.features || []).length === 0 && !isLoading && <Typography variant="body2" color="text.secondary" sx={{p:1}}>ویژگی‌ای تعریف نشده.</Typography>}
                </FormGroup>
            ))}

            {/* Size Filter */}
            {renderFilterAccordion('size', 'سایز', (
                <FormGroup sx={{ maxHeight: 180, overflowY: 'auto', pr: 1, ml: -1 }}>
                    {(safeOptions.sizes || []).map(size => (
                        <FormControlLabel
                            key={size}
                            control={<Checkbox checked={safeLocalFilters.sizes?.includes(size) || false} onChange={() => handleCheckboxChange('sizes', size)} size="small" sx={{py: 0.2}} />}
                            label={size} sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                        />
                    ))}
                     {(safeOptions.sizes || []).length === 0 && !isLoading && <Typography variant="body2" color="text.secondary" sx={{p:1}}>سایزی یافت نشد.</Typography>}
                 </FormGroup>
            ))}

            {/* Action Buttons */}            <Box className="filter-actions" sx={{ mt: 2, p: 1 }}>
                <Button variant="contained" startIcon={<FilterAltIcon />} onClick={handleApplyClick} fullWidth sx={{ mb: 1, fontWeight: 600 }}>
                    اعمال فیلتر
                </Button>
                <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={clearLocalFilters} fullWidth color="secondary" size="small">
                    حذف همه فیلترها
                </Button>
            </Box>
        </Box>
    );
};

export default FilterSidebar;
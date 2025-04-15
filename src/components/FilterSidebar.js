import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button, Skeleton, Divider, Accordion, AccordionSummary, AccordionDetails, List, ListItemButton, ListItemText, Collapse, IconButton, Tooltip } from '@mui/material'; // <--- Tooltip اضافه شد
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link as RouterLink, useParams } from 'react-router-dom';
// import '../styles/FilterSidebar.css'; // <--- یا مسیر CSS مربوط به سایدبار اگر جداست

// --- Helper Components (ColorSwatch, CategoryListItem) ---
// (کد این کامپوننت‌های کمکی از پاسخ قبلی بدون تغییر باقی می‌ماند)
// Color Swatch Component
const ColorSwatch = ({ color, selected, onClick }) => (
    <Tooltip title={color.name} placement="top"> {/* Tooltip حالا تعریف شده است */}
        <Box            onClick={() => onClick(color.code)}
            sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: color.code,
                border: color.code === '#FFFFFF' ? '1px solid #ccc' : 'none',
                cursor: 'pointer',
                display: 'flex',                alignItems: 'center',
                justifyContent: 'center',                transition: 'transform 0.1s ease-in-out',                '&:hover': { transform: 'scale(1.1)' },
                outline: selected ? `2px solid ${color.code === '#000000' ? '#fff' : '#000'}` : 'none', // Contrast outline
                outlineOffset: '2px',
                boxShadow: selected ? '0 0 5px rgba(0,0,0,0.3)' : 'none',
                m: 0.5, // Margin around swatch
            }}
        >
            {selected && color.code !== '#FFFFFF' && (
                 <CheckCircleIcon sx={{ fontSize: 16, color: '#fff', filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' }} />
            )}             {selected && color.code === '#FFFFFF' && (
                 <CheckCircleIcon sx={{ fontSize: 16, color: '#000', filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' }} />             )}
        </Box>
    </Tooltip>
);

// Recursive Category List Item
const CategoryListItem = ({ category, level = 0, currentCategoryId }) => {
    const [open, setOpen] = useState(false); // State for expanding children
    const hasChildren = category.children && category.children.length > 0;
    // Check if the current category or one of its parents is the active category
    const isActive = category.id === currentCategoryId; // Simple check for now

    const handleClick = (event) => {
        if (hasChildren) {
            event.preventDefault(); // Prevent navigation if it has children, just toggle
            setOpen(!open);
        }
        // Navigation is handled by the Link component itself
    };

    return (        <>
            <ListItemButton
                component={RouterLink}
                to={`/category/${category.id}`} // Make sure your routes match this pattern
                sx={{                    pl: 2 + level * 2, // Indentation
                    backgroundColor: isActive ? 'action.selected' : 'transparent',
                    borderRight: isActive ? '3px solid' : 'none',
                    borderRightColor: 'primary.main',
                    py: 0.5, // Adjust padding
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    }
                 }}
                onClick={handleClick} // Handle toggle/navigation prevention
                selected={isActive} // Highlight selected
                dense
            >
                <ListItemText primary={category.name} sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', fontWeight: isActive ? 500 : 400 } }}/>
                {hasChildren ? (open ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />) : null}
            </ListItemButton>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {category.children.map((child) => (
                            <CategoryListItem key={child.id} category={child} level={level + 1} currentCategoryId={currentCategoryId}/>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

// --- Main Filter Sidebar ---
const FilterSidebar = ({ categories = [], options, initialFilters, onApplyFilters, isLoading = false }) => {
    // (State: localFilters, brandSearch, expandedAccordions از پاسخ قبلی)
     const defaultFiltersState = useMemo(() => ({
        brands: initialFilters?.brands || [],        colors: initialFilters?.colors || [],        sizes: initialFilters?.sizes || [],
        features: initialFilters?.features || [],
        price_min: initialFilters?.price_min || '',
        price_max: initialFilters?.price_max || '',    }), [initialFilters]);

    const [localFilters, setLocalFilters] = useState(defaultFiltersState);
    const [brandSearch, setBrandSearch] = useState(''); // State for brand search term
    const [expandedAccordions, setExpandedAccordions] = useState({ // Control accordion expansion
        price: true, // Keep price open by default maybe
        brand: true, // Keep brand open too
        color: true,
        feature: false,
        size: false,
    });

    const { categoryId: currentCategoryId } = useParams();

    // Sync local state
     useEffect(() => {        setLocalFilters({
            brands: initialFilters?.brands || [],
            colors: initialFilters?.colors || [],
            sizes: initialFilters?.sizes || [],
            features: initialFilters?.features || [],
            price_min: initialFilters?.price_min || '',            price_max: initialFilters?.price_max || '',
        });
    }, [initialFilters]);

    // --- Handlers ---
    // (handleAccordionChange, handleCheckboxChange, handleColorSwatchClick, handlePriceChange, handleApplyClick, clearLocalFilters از پاسخ قبلی)
     const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordions(prev => ({ ...prev, [panel]: isExpanded }));
    };

    const handleCheckboxChange = (groupName, value) => {
        setLocalFilters(prev => {
            const currentGroup = prev[groupName] || [];
            const newGroup = currentGroup.includes(value)
                ? currentGroup.filter(item => item !== value) // Remove if exists
                : [...currentGroup, value]; // Add if not exists
            return { ...prev, [groupName]: newGroup };
        });
    };

    const handleColorSwatchClick = (colorCode) => {
        handleCheckboxChange('colors', colorCode); // Reuse checkbox logic for colors array
    };

    const handlePriceChange = useCallback((event) => {
        const { name, value } = event.target;
        const numericValue = value === '' ? '' : value.replace(/[^0-9]/g, '');
        setLocalFilters(prev => ({ ...prev, [name]: numericValue }));
    }, []);

    const handleApplyClick = useCallback(() => {
        console.log("Sidebar Applying Filters:", localFilters);
        onApplyFilters(localFilters);    }, [localFilters, onApplyFilters]);

    const clearLocalFilters = useCallback(() => {        setLocalFilters({ brands: [], colors: [], sizes: [], features: [], price_min: '', price_max: '' });
        setBrandSearch(''); // Clear brand search as well
        onApplyFilters({ brands: [], colors: [], sizes: [], features: [], price_min: '', price_max: '' });
    }, [onApplyFilters]);


    // Filter brands
    const filteredBrands = useMemo(() => {
        if (!options?.brands) return [];
        if (!brandSearch) return options.brands;
        const searchLower = brandSearch.toLowerCase();
        return options.brands.filter(brand => brand.toLowerCase().includes(searchLower));
    }, [options?.brands, brandSearch]);

    // --- Render ---
    const safeOptions = options || { colors: [], sizes: [], brands: [], features: [] };

    // Helper to render Accordions
    const renderFilterAccordion = (id, title, content) => (
         <Accordion
            disableGutters
            elevation={0}
            square
            sx={{ borderBottom: 1, borderColor: 'divider', '&:before': { display: 'none' }, bgcolor: 'transparent' }} // Transparent background
            expanded={expandedAccordions[id]}
            onChange={handleAccordionChange(id)}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: '40px', '& .MuiAccordionSummary-content': { my: '8px' } }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}> {/* Reduced padding */}
                {isLoading ? <Skeleton height={60}/> : content}
            </AccordionDetails>        </Accordion>
    );

    return (
        // Box styles can be applied via CSS class or sx
        <Box className="filter-sidebar-content">
             {/* Categories Section */}
             {/* Wrap Categories in an Accordion maybe? Or just a Box */}
             <Box mb={2}>
                 <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: '1.0rem', px: 1 }}>
                     دسته‌بندی‌ها
                 </Typography>
                 {isLoading && ( <> <Skeleton height={30}/> <Skeleton height={30}/> <Skeleton height={30}/> </> )}
                 {!isLoading && categories.length > 0 && (
                      <List dense component="nav" sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
                         {categories.map(cat => (
                             <CategoryListItem key={cat.id} category={cat} currentCategoryId={currentCategoryId}/>
                         ))}
                     </List>
                 )}
                 {!isLoading && categories.length === 0 && ( <Typography variant="body2" color="text.secondary" sx={{px: 1}}>دسته بندی یافت نشد.</Typography> )}
             </Box>

            <Divider sx={{ my: 1 }} />

            <Typography variant="h6" sx={{ mb: 0, fontWeight: 600, fontSize: '1.0rem', px: 1 }}>
                فیلترها            </Typography>

            {/* Price Filter */}
            {renderFilterAccordion('price', 'محدوده قیمت', (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField label="از" variant="outlined" size="small" name="price_min" value={localFilters.price_min} onChange={handlePriceChange} InputProps={{ inputMode: 'numeric' }} sx={{ textAlign: 'center', '& input': {textAlign: 'center', p: '8.5px 5px'}, fontSize: '0.8rem' }} />
                     <Typography sx={{color: 'text.secondary'}}>-</Typography>
                    <TextField label="تا" variant="outlined" size="small" name="price_max" value={localFilters.price_max} onChange={handlePriceChange} InputProps={{ inputMode: 'numeric' }} sx={{ textAlign: 'center', '& input': {textAlign: 'center', p: '8.5px 5px'}, fontSize: '0.8rem' }} />
                </Box>            ))}

            {/* Brand Filter */}            {renderFilterAccordion('brand', 'برند', (
                <>
                    <TextField
                        fullWidth                        variant="outlined"
                        size="small"
                        placeholder="جستجوی برند..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        InputProps={{ endAdornment: <IconButton size="small"><SearchIcon fontSize="small" /></IconButton>, sx:{pr: 0.5} }}
                        sx={{ mb: 1 }}
                    />
                    <FormGroup sx={{ maxHeight: 180, overflowY: 'auto', pr: 1, ml: -1 }}> {/* Scrollable & adjust margin */}
                        {filteredBrands.map(brand => (
                            <FormControlLabel
                                key={brand}
                                control={<Checkbox checked={localFilters.brands.includes(brand)} onChange={() => handleCheckboxChange('brands', brand)} size="small" sx={{py: 0.2}} />}                                label={brand}
                                sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                            />
                        ))}
                         {filteredBrands.length === 0 && !isLoading && <Typography variant="body2" color="text.secondary" sx={{p:1}}>برندی یافت نشد.</Typography>}                    </FormGroup>
                </>
            ))}

            {/* Color Filter */}            {renderFilterAccordion('color', 'رنگ', (
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', p: 0.5, ml: -0.5 }}>                     {safeOptions.colors.map(color => (
                         <ColorSwatch
                            key={color.code}
                            color={color}                            selected={localFilters.colors.includes(color.code)}
                            onClick={handleColorSwatchClick}
                        />
                    ))}
                </Box>
            ))}

            {/* Features Filter */}
             {renderFilterAccordion('feature', 'ویژگی‌ها', (
                <FormGroup sx={{ml: -1}}>
                    {safeOptions.features.map(feature => (
                        <FormControlLabel
                            key={feature.id}
                            control={<Checkbox checked={localFilters.features.includes(feature.id)} onChange={() => handleCheckboxChange('features', feature.id)} size="small" sx={{py: 0.2}} />}
                            label={feature.label}
                            sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                        />
                    ))}
                </FormGroup>
            ))}

            {/* Size Filter */}
            {renderFilterAccordion('size', 'سایز', (
                <FormGroup sx={{ maxHeight: 180, overflowY: 'auto', pr: 1, ml: -1 }}> {/* Scrollable & adjust margin */}
                    {safeOptions.sizes.map(size => (
                        <FormControlLabel
                            key={size}                            control={<Checkbox checked={localFilters.sizes.includes(size)} onChange={() => handleCheckboxChange('sizes', size)} size="small" sx={{py: 0.2}} />}
                            label={size}
                            sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                        />
                    ))}
                </FormGroup>
            ))}            {/* Action Buttons */}
            <Box className="filter-actions" sx={{ mt: 2, p: 1 }}>
                <Button variant="contained" startIcon={<FilterAltIcon />} onClick={handleApplyClick} fullWidth sx={{ mb: 1, fontWeight: 600 }}>
                    اعمال فیلتر
                </Button>
                <Button variant="outlined" // Use outlined for clear
                        startIcon={<RestartAltIcon />} onClick={clearLocalFilters} fullWidth color="secondary" size="small"> {/* Secondary color and smaller */}
                    حذف همه فیلترها
                </Button>
            </Box>
        </Box>
    );
};

export default FilterSidebar;
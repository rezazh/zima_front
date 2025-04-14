// src/components/FilterSidebar.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Accordion, AccordionSummary, AccordionDetails, Checkbox, FormGroup, FormControlLabel, Switch, Button, Chip, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import '../styles/FilterSidebar.css'; // Import styles

// Default filters structure
const defaultFiltersState = {
    search: '', sizes: [], colors: [], brands: [], price_min: '', price_max: '', inStock: false, menOnly: true
};

// Small component for visual color options
const ColorOption = ({ color, isSelected, onClick }) => (
    <Tooltip title={color} placement="top">
      <Box
        className={`color-swatch ${isSelected ? 'selected' : ''}`}
        sx={{ backgroundColor: String(color).toLowerCase() }} // Ensure color is string and lowercase
        onClick={() => onClick(color)}
        role="button"
        tabIndex={0}        onKeyPress={(e) => e.key === 'Enter' && onClick(color)}
      />
    </Tooltip>
  );

const FilterSidebar = ({ options, initialFilters, onApplyFilters }) => {  // Local State for user selections before applying
  const [localFilters, setLocalFilters] = useState(initialFilters || defaultFiltersState);
  // State for accordion expansion control
  const [expanded, setExpanded] = useState({ price: true, size: true, color: true, brand: true }); // Start all expanded  // Effect to sync local state if initialFilters change from parent
  useEffect(() => {
    if (initialFilters) {
      setLocalFilters(initialFilters);
    } else {
      setLocalFilters(defaultFiltersState);
    }
  }, [initialFilters]);

  // --- Handlers for updating localFilters ---
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(prev => ({ ...prev, [panel]: isExpanded }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;    setLocalFilters(prev => ({ ...(prev || defaultFiltersState), [name]: value }));
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setLocalFilters(prev => ({ ...(prev || defaultFiltersState), [name]: checked }));
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
    setLocalFilters(prev => ({ ...(prev || defaultFiltersState), [name]: numericValue }));
  };

  const handleMultiSelectChange = (filterName, value) => {
    const currentSelection = Array.isArray(localFilters?.[filterName]) ? localFilters[filterName] : [];
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter(item => item !== value)
      : [...currentSelection, value];
    setLocalFilters(prev => ({ ...(prev || defaultFiltersState), [filterName]: newSelection }));
  };

  // --- Render Helper for Checkboxes ---
  const renderCheckboxes = (items = [], checkedItems = [], filterName) => (
    <FormGroup className="filter-options-list checkbox-group">
      {items && items.length > 0 ? (
        items.map(item => (
          <FormControlLabel
            key={`${filterName}-${item}`}
            control={
              <Checkbox
                checked={checkedItems?.includes(item) || false}
                onChange={() => handleMultiSelectChange(filterName, item)}
                size="small"
              />
            }
            label={item}
            className="filter-checkbox-label"
          />
        ))
      ) : (
        <Typography variant="caption" color="textSecondary" sx={{ p: 1 }}>گزینه‌ای موجود نیست.</Typography>
      )}
    </FormGroup>
  );

  // --- Action Handlers ---
  const handleApplyClick = () => {
    const filtersToApply = {
        ...(localFilters || defaultFiltersState), // Use safe object
        price_min: localFilters?.price_min || '',
        price_max: localFilters?.price_max || ''
    };    onApplyFilters(filtersToApply);
  };

  const clearLocalFilters = () => {
      setLocalFilters(defaultFiltersState);
      onApplyFilters(defaultFiltersState);
      setExpanded({ price: true, size: true, color: true, brand: true });
  };  // --- Render ---
  const safeLocalFilters = localFilters || defaultFiltersState;
  // Ensure options is always an object
  const safeOptions = options || { colors: [], sizes: [], brands: [] };  return (
    <Box className="filter-sidebar-container">
      <Typography variant="h6" className="filter-main-title"> فیلتر محصولات </Typography>

      {/* Search */}
      <Box className="filter-section search-section">
        <TextField fullWidth variant="outlined" size="small" placeholder="نام محصول..." name="search" value={safeLocalFilters.search} onChange={handleInputChange} className="search-input-field"/>
      </Box>

      {/* Toggles */}
      <Box className="filter-section toggle-section">
        <FormGroup>
          <FormControlLabel control={<Switch checked={safeLocalFilters.inStock} onChange={handleSwitchChange} name="inStock" size="small"/>} label="فقط کالاهای موجود" className="filter-switch-label"/>
          <FormControlLabel control={<Switch checked={safeLocalFilters.menOnly} onChange={handleSwitchChange} name="menOnly" size="small"/>} label="فقط کالاهای دسته : مردانه" className="filter-switch-label"/>
        </FormGroup>
      </Box>

      {/* Price Filter */}
      <Accordion className="filter-accordion" expanded={expanded.price} onChange={handleAccordionChange('price')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="filter-accordion-summary">
              <Typography>محدوده قیمت</Typography>
              {(safeLocalFilters.price_min || safeLocalFilters.price_max) && (
                  <Chip label={`${safeLocalFilters.price_min || '۰'} - ${safeLocalFilters.price_max || '∞'}`} size="small" sx={{ mr: 1 }} />
              )}
          </AccordionSummary>
          <AccordionDetails className="filter-accordion-details price-filter-details">
              <Box className="price-inputs-container">
                 <TextField label="از (تومان)" variant="outlined" size="small" name="price_min" value={safeLocalFilters.price_min} onChange={handlePriceChange} className="price-input-field" InputProps={{ inputMode: 'numeric' }}/>
                 <TextField label="تا (تومان)" variant="outlined" size="small" name="price_max" value={safeLocalFilters.price_max} onChange={handlePriceChange} className="price-input-field" InputProps={{ inputMode: 'numeric' }}/>
              </Box>
          </AccordionDetails>
      </Accordion>

      {/* Size Filter - Conditionally render based on options */}
      {safeOptions.sizes?.length > 0 && (
        <Accordion className="filter-accordion" expanded={expanded.size} onChange={handleAccordionChange('size')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="filter-accordion-summary">
            <Typography>سایز</Typography>
            {safeLocalFilters.sizes?.length > 0 && <Chip label={safeLocalFilters.sizes.length} size="small" sx={{ mr: 1 }} />}
          </AccordionSummary>
          <AccordionDetails className="filter-accordion-details">
            {renderCheckboxes(safeOptions.sizes, safeLocalFilters.sizes, 'sizes')}
          </AccordionDetails>
        </Accordion>      )}

      {/* Color Filter - Conditionally render based on options */}
       {safeOptions.colors?.length > 0 && (
        <Accordion className="filter-accordion" expanded={expanded.color} onChange={handleAccordionChange('color')}>          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="filter-accordion-summary">
            <Typography>رنگ</Typography>
             {safeLocalFilters.colors?.length > 0 && <Chip label={safeLocalFilters.colors.length} size="small" sx={{ mr: 1 }} />}
          </AccordionSummary>
          <AccordionDetails className="filter-accordion-details">
            <Box className="color-options-container">
              {safeOptions.colors.map(color => (                <ColorOption key={color} color={color} isSelected={safeLocalFilters.colors?.includes(color)} onClick={() => handleMultiSelectChange('colors', color)}/>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

       {/* Brand Filter - Conditionally render based on options */}
       {safeOptions.brands?.length > 0 && (
        <Accordion className="filter-accordion" expanded={expanded.brand} onChange={handleAccordionChange('brand')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="filter-accordion-summary">
            <Typography>برند</Typography>
             {safeLocalFilters.brands?.length > 0 && <Chip label={safeLocalFilters.brands.length} size="small" sx={{ mr: 1 }} />}
          </AccordionSummary>
          <AccordionDetails className="filter-accordion-details">
            {renderCheckboxes(safeOptions.brands, safeLocalFilters.brands, 'brands')}
          </AccordionDetails>
        </Accordion>
      )}      {/* Action Buttons */}
      <Box className="filter-actions">
         <Button variant="contained" startIcon={<FilterAltIcon />} onClick={handleApplyClick} className="apply-button" fullWidth> اعمال فیلتر </Button>
         <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={clearLocalFilters} className="clear-button" fullWidth> پاک کردن </Button>
      </Box>    </Box>
  );
};

export default FilterSidebar;
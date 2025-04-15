import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';import { Link as RouterLink } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Parent component (MenProducts) handles loading state and shows skeletons    if (!product || !product.id) {
        console.warn("ProductCard received invalid product data:", product);
        return null; // Render nothing if product data is invalid    }

    // Helper to format price to Persian locale
    const formatPrice = (price) => {
        try {
            const numericPrice = Number(price);
            return isNaN(numericPrice) ? '' : numericPrice.toLocaleString('fa-IR');
        } catch (e) {
            console.error("Error formatting price:", price, e);
            return '';
        }
    };

    // Calculate discount info from backend 'price' (final) and 'discount' (amount)
    const finalPrice = parseFloat(product.price || 0);
    const discountAmount = parseFloat(product.discount || 0);
    const originalPrice = discountAmount > 0 ? finalPrice + discountAmount : finalPrice;
    const hasDiscount = discountAmount > 0;
    const discountPercent = (hasDiscount && originalPrice > 0)
                           ? Math.round((discountAmount / originalPrice) * 100)
                           : 0;
    // Split color string - Check if it's a string before splitting
    const colorNames = (typeof product.colors === 'string' && product.colors)
                      ? product.colors.split(',').map(c => c.trim()).filter(Boolean)
                      : [];

    // Split size string - Check if it's a string before splitting
    const sizes = (typeof product.sizes === 'string' && product.sizes) // <--- *** اصلاح کلیدی ***
                 ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
                 : []; // Return empty array if not a non-empty string

    // Construct absolute image URL (assuming apiService already handles this)
    const imageUrl = product.image || "https://via.placeholder.com/350x450?text=No+Image"; // Use URL from product object

    return (
        <Card elevation={0} sx={{
             height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px',
             overflow: 'hidden', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s ease-in-out',
             '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
         }}>
            <CardActionArea component={RouterLink} to={`/product/${product.id}`} sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={product.name || 'Product Image'}
                    sx={{ objectFit: 'cover', aspectRatio: '3/4', bgcolor: '#f5f5f5' }}
                />
                <CardContent sx={{ pt: 1.5, pb: 1, px: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>                    {/* Top part: Brand and Name */}
                    <Box>                        {product.brand && (
                             <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ mb: 0.5, fontSize: '0.75rem', textAlign:'center' }}>
                                {product.brand}
                            </Typography>
                        )}
                        <Typography variant="body2" component="h3" title={product.name} sx={{
                            fontWeight: 500, mb: 1, height: '40px', lineHeight: '20px',                            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textAlign: 'center'
                        }}>
                            {product.name || 'بدون نام'}
                        </Typography>
                    </Box>

                    {/* Bottom part: Colors and Price */}
                    <Box>
                         {/* Color Names (Chips) */}
                         {colorNames.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 1.5, minHeight: '18px' }}>
                                {colorNames.slice(0, 4).map((name) => (
                                    <Chip key={name} label={name} size="small" variant="outlined" sx={{fontSize: '0.65rem', height: 'auto', '& .MuiChip-label': { px: '6px', py: '1px'} }} />
                                ))}
                            </Box>
                         )}                         {/* You could add sizes here similarly if needed */}
                         {/*                         {sizes.length > 0 && (
                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 1.5, minHeight: '18px' }}>
                                 {sizes.slice(0, 5).map((size) => (
                                     <Chip key={size} label={size} size="small" variant="outlined" sx={{fontSize: '0.65rem', height: 'auto', '& .MuiChip-label': { px: '6px', py: '1px'} }} />
                                 ))}
                             </Box>
                         )}
                         */}

                        {/* Price Section */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
                            {hasDiscount && discountPercent > 0 && (
                                <Chip label={`${discountPercent}%`} color="error" size="small" sx={{ height: 'auto', fontSize: '0.7rem', '& .MuiChip-label': { px: '5px', py: '1px'} }}/>
                            )}
                            {!hasDiscount && <Box sx={{width: '35px'}}></Box>} {/* Placeholder */}

                            <Box sx={{textAlign: 'left'}}>
                                {hasDiscount && originalPrice > finalPrice && (
                                    <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block', fontSize: '0.75rem' }}>
                                        {formatPrice(originalPrice)}
                                    </Typography>
                                )}                                <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.2 }}>
                                     {formatPrice(finalPrice)} <Typography variant="caption" component="span" sx={{fontSize: '0.7rem'}}>تومان</Typography>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ProductCard;
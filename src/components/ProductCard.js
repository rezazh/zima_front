import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';import { Link as RouterLink } from 'react-router-dom';
// import '../styles/ProductCard.css'; // Add styles if needed

const ProductCard = ({ product }) => {
    if (!product) {
        return null; // Or return a Skeleton
    }

    const formatPrice = (price) => {
        return price ? price.toLocaleString('fa-IR') : 'نامشخص';
    };

    return (
        <Card elevation={0} sx={{ border: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea component={RouterLink} to={`/product/${product.id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}> {/* Adjust link as needed */}
                <CardMedia
                    component="img"
                    height="200" // Adjust height as needed
                    image={product.imageUrl || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={product.name}
                    sx={{ objectFit: 'contain', p: 1 }} // Use contain to show full image maybe
                />
                <CardContent sx={{ pt: 1, pb: 0.5, width: '100%', flexGrow: 1 }}>
                    {product.brand && (
                        <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ mb: 0.5 }}>
                            {product.brand}
                        </Typography>
                    )}
                    <Typography gutterBottom variant="body2" component="h3" noWrap sx={{ fontWeight: 500, minHeight: '2.5em' }}> {/* Ensure enough height for 2 lines */}
                        {product.name}
                    </Typography>                    {/* Display available color swatches */}
                    {product.availableColors && product.availableColors.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, minHeight: '20px' }}>
                            {product.availableColors.slice(0, 5).map((color) => ( // Limit shown colors
                                <Box
                                    key={color.code}
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        backgroundColor: color.code,
                                        border: color.code === '#FFFFFF' ? '1px solid #ccc' : 'none',
                                        display: 'inline-block',
                                    }}                                    title={color.name}
                                />
                            ))}
                        </Box>
                    )}
                </CardContent>
            </CardActionArea>
             {/* Price Section (outside ActionArea if needed) */}
            <Box sx={{ p: 1.5, pt: 0 }}>
                {product.price_max && product.discountPercent > 0 && ( // Show discount
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Chip label={`${product.discountPercent}%`} color="error" size="small" sx={{ height: 'auto', '& .MuiChip-label': { p: '1px 4px'} }}/>
                        <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            {formatPrice(product.price_max)}
                        </Typography>
                    </Box>
                )}
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                    {formatPrice(product.price_min)} <Typography variant="caption" component="span">تومان</Typography>
                </Typography>
            </Box>
        </Card>
    );};

export default ProductCard;
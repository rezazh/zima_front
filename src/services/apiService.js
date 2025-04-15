// src/services/apiService.js
import axios from 'axios';

// آدرس پایه API بک‌اند شما
const API_BASE_URL = 'http://127.0.0.1:8000';

// --- Helper Function to build URL with query params (handles arrays) ---
const buildApiUrl = (relativeUrl, params) => {
    const path = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
    const url = new URL(path, API_BASE_URL);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item !== undefined && item !== null && item !== '') {
                        url.searchParams.append(key, item);
                    }
                });
            } else {
                url.searchParams.set(key, value);
            }
        }
    });
    return url.toString();
};

// --- API Functions ---

export const getCategories = async () => {
    const url = `${API_BASE_URL}/api/products/categories/`;
    console.log(`API Call: Fetching categories from ${url}`);
    try {
        const response = await axios.get(url);
        console.log("API Response: Categories", response.data);
        return response.data || [];
    } catch (error) {
        console.error("API Error fetching categories:", error.response?.data || error.message);
        throw new Error("خطا در دریافت دسته‌بندی‌ها از سرور.");
    }
};

export const getFilterOptions = async (category = null) => {
    const url = `${API_BASE_URL}/api/products/filter-options/`;
    console.log(`API Call: Fetching filter options from ${url}`);
    try {
        const response = await axios.get(url);
        console.log("API Response: Filter Options Raw", response.data);
        const options = response.data || {};
        const formattedOptions = {
            colors: options.colors || [],
            sizes: options.sizes || [],
            brands: options.brands || [],
            features: [
                { id: 'inStock', label: 'فقط کالاهای موجود' },
                { id: 'hasDiscount', label: 'کالاهای تخفیف‌دار' },
            ]
        };
        console.log("API Response: Filter Options Formatted", formattedOptions);
        return formattedOptions;
    } catch (error) {
        console.error("API Error fetching filter options:", error.response?.data || error.message);
        throw new Error("خطا در دریافت گزینه‌های فیلتر از سرور.");
    }
};

export const getMenProducts = async (params) => {
    const apiParams = {
        page: params.page || 1,        search: params.search || undefined,
        brand: params.brands || [],
        color: params.colors || [],
        size: params.sizes || [],
        price_min: params.price_min || undefined,
        price_max: params.price_max || undefined,
        sort: mapSortKey(params.sortBy || 'newest'),
        // feature: params.features || []
    };    const relativeUrl = '/api/products/men/';
    const url = buildApiUrl(relativeUrl, apiParams);

    console.log(`API Call: Fetching men products from ${url}`);

    try {
        const response = await axios.get(url);
        console.log("API Response: Men Products Raw", response.data);

        if (response.data && typeof response.data.count !== 'undefined' && Array.isArray(response.data.results)) {
            const backendPageSize = 12;
            const totalItems = response.data.count;
            const totalPages = Math.ceil(totalItems / backendPageSize);

            const productsWithAbsoluteUrls = response.data.results.map(product => ({
                ...product,
                image: makeImageUrlAbsolute(product.image),
                images: Array.isArray(product.images) ? product.images.map(imgObj => ({
                    ...imgObj,
                    image: makeImageUrlAbsolute(imgObj.image)
                })) : [],
            }));            const formattedResponse = {
                data: productsWithAbsoluteUrls,
                totalPages: totalPages,
                totalItems: totalItems,
            };
            console.log("API Response: Men Products Formatted", formattedResponse);
            return formattedResponse;
        } else {
            console.error("Invalid product response structure:", response.data);
            throw new Error("ساختار پاسخ دریافت محصولات نامعتبر است.");
        }
    } catch (error) {
        console.error("API Error fetching men products:", error.response?.data || error.message);
        const errorMsg = error.response?.data?.error || error.message || "خطای ناشناخته در دریافت محصولات.";
        throw new Error(errorMsg);
    }
};

// Helper to map frontend sort keys to backend keys
const mapSortKey = (frontendKey) => {
    switch (frontendKey) {
        case 'newest': return '-created_at';
        case 'price_asc': return 'price_low';
        case 'price_desc': return 'price_high';
        case 'most_visited': return 'popular';
        default: return '-created_at';
    }
};

// Helper function to make image URLs absolute if they aren't
const makeImageUrlAbsolute = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    try {
        const baseOrigin = new URL(API_BASE_URL).origin;        const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        return `${baseOrigin}${path}`;
    } catch (e) {
        console.error("Could not construct absolute URL for image:", imageUrl, e);
        return imageUrl;
    }
};

// --- Add other API functions as needed ---
export const getProductDetail = async (productId) => {
    const url = `${API_BASE_URL}/api/products/product/${productId}/`;
    console.log(`API Call: Fetching product detail from ${url}`);
    try { // <--- شروع try
        const response = await axios.get(url);
        console.log("API Response: Product Detail Raw", response.data);
        if (response.data?.product) {
             const productData = response.data.product;
             productData.image = makeImageUrlAbsolute(productData.image);
             if (productData.images && Array.isArray(productData.images)) {
                 productData.images = productData.images.map(imgObj => ({
                     ...imgObj,
                     image: makeImageUrlAbsolute(imgObj.image)
                 }));
             }
             console.log("API Response: Product Detail Formatted", productData);
            return productData;
        } else {
             throw new Error("ساختار پاسخ جزئیات محصول نامعتبر است.");
        }
    } catch (error) { // <--- بلوک catch اضافه شد
        console.error(`API Error fetching product detail for ID ${productId}:`, error.response?.data || error.message);
        const errorMsg = error.response?.data?.error || "خطا در دریافت جزئیات محصول.";
        throw new Error(errorMsg); // پرتاب مجدد خطا
    } // <--- پایان catch
};
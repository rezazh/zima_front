// src/services/apiService_placeholder.js

// --- Placeholder Categories ---
const placeholderCategories = [
    { id: 'men-underwear', name: 'لباس زیر مردانه', children: [
        { id: 'men-underwear-bottom', name: 'شورت مردانه' },
        { id: 'men-undershirt', name: 'زیرپوش مردانه' },
    ]},
    { id: 'men-homewear', name: 'لباس راحتی مردانه', children: [        { id: 'men-homewear-sets', name: 'ست تیشرت و شلوار' },
        { id: 'men-shorts', name: 'شلوارک مردانه' },
        { id: 'men-trousers', name: 'شلوار مردانه' },
    ]},
    { id: 'men-towel', name: 'حوله مردانه' },
    { id: 'men-socks', name: 'جوراب مردانه' },
];

// --- Placeholder Filter Options ---
const placeholderFilterOptions = {
    // Colors with names and codes for swatches
    colors: [        { name: "آبی", code: "#2196F3" },
        { name: "قرمز", code: "#f44336" },
        { name: "مشکی", code: "#000000" },
        { name: "سفید", code: "#FFFFFF" },
        { name: "سبز", code: "#4CAF50" },
        { name: "طوسی", code: "#9E9E9E" },
        { name: "زرد", code: "#FFEB3B" },
        { name: "بنفش", code: "#9C27B0" },        { name: "نارنجی", code: "#FF9800" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL", "Free Size", "38", "40", "42", "44"],
    brands: ["Shargh", "Negin", "Adidas", "Puma", "Nike", "Reebok", "LC Waikiki", "Generic Brand", "Brand X", "Brand Y"],
    features: [ // Features to filter by
        { id: 'inStock', label: 'فقط کالاهای موجود' },
        { id: 'hasDiscount', label: 'کالاهای تخفیف‌دار' },
    ]
};

// --- Placeholder Product Data ---
const allPlaceholderProducts = Array.from({ length: 65 }, (_, i) => {
    const brand = placeholderFilterOptions.brands[i % placeholderFilterOptions.brands.length];
    const basePrice = Math.floor(Math.random() * (700000 - 30000 + 1)) + 30000;
    const hasDiscount = Math.random() < 0.3; // 30% chance of discount
    const discountPercent = hasDiscount ? Math.floor(Math.random() * (50 - 10 + 1)) + 10 : 0; // 10-50% discount
    const finalPrice = hasDiscount ? Math.round(basePrice * (1 - discountPercent / 100)) : basePrice;
    // Select 1 to 3 available colors for this product
    const availableColors = placeholderFilterOptions.colors
        .sort(() => 0.5 - Math.random()) // Shuffle colors
        .slice(0, Math.floor(Math.random() * 3) + 1); // Pick 1-3

    return {        id: `M${1001 + i}`, // Unique ID        name: `محصول مردانه ${brand} مدل ${100 + i}`,
        brand: brand,
        price_min: finalPrice, // Use final price
        price_max: hasDiscount ? basePrice : null, // Original price if discount
        discountPercent: discountPercent,
        imageUrl: `https://via.placeholder.com/350x450.png?text=Product+${i+1}`, // Placeholder image
        availableColors: availableColors, // Array of {name, code}
        availableSizes: placeholderFilterOptions.sizes.filter(() => Math.random() > 0.5), // Random subset of sizes
        inStock: Math.random() > 0.15, // 85% chance of being in stock
        hasDiscount: hasDiscount,
        visits: Math.floor(Math.random() * 5000), // For sorting by most visited
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random creation date in last 60 days
        categoryIds: ['men-underwear', 'men-homewear', 'men-towel', 'men-socks'].sort(() => 0.5 - Math.random()).slice(0,1) // Assign to one main category randomly
    };
});


// --- Placeholder API Functions ---

// Function to get categories (can be extended for specific parent later)
export const getCategories = async (parentId = null) => {
    console.log("Placeholder: Fetching categories...");
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
    return placeholderCategories; // Return top-level categories for now
};

export const getFilterOptions = async (category) => {
    console.log(`Placeholder: Fetching filter options for ${category}...`);
    await new Promise(resolve => setTimeout(resolve, 200));
    return placeholderFilterOptions;
};

// Updated getMenProducts to handle new filters and sorting
export const getMenProducts = async (params) => {
    console.log("Placeholder: Fetching men products with params:", params);
    const {        page = 1,        limit = 12,
        sortBy = 'newest', // 'newest', 'most_visited', 'price_asc', 'price_desc'
        category = null, // Specific category ID like 'men-underwear-bottom'
        // Filters - note they can be arrays now for multi-select
        brands = [], // Array of selected brand names
        colors = [], // Array of selected color codes
        sizes = [],  // Array of selected size names
        features = [], // Array of selected feature IDs ('inStock', 'hasDiscount')
        price_min = '',
        price_max = '',
    } = params;

    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay    // --- Filtering ---
    let filteredProducts = allPlaceholderProducts.filter(p => {
        // Category filter (simple check if product belongs to the selected category or its parents/children - can be more complex)
        const categoryMatch = !category || p.categoryIds.includes(category) // Basic check for now
            // || placeholderCategories.some(cat => cat.id === category && p.categoryIds.includes(cat.id)) // More complex check needed

        // Brand filter (check if product brand is in the selected brands array)
        const brandMatch = brands.length === 0 || brands.includes(p.brand);

        // Color filter (check if *any* of the product's available colors match selected colors)
        const colorMatch = colors.length === 0 || p.availableColors.some(prodColor => colors.includes(prodColor.code));

        // Size filter (check if *any* of the product's available sizes match selected sizes)
        const sizeMatch = sizes.length === 0 || p.availableSizes.some(prodSize => sizes.includes(prodSize));

        // Price filter
        const priceMinMatch = !price_min || p.price_min >= parseInt(price_min, 10);
        const priceMaxMatch = !price_max || p.price_min <= parseInt(price_max, 10);

        // Feature filter
        const stockMatch = !features.includes('inStock') || p.inStock === true;
        const discountMatch = !features.includes('hasDiscount') || p.hasDiscount === true;

        return categoryMatch && brandMatch && colorMatch && sizeMatch && priceMinMatch && priceMaxMatch && stockMatch && discountMatch;
    });

    // --- Sorting ---
    switch (sortBy) {
        case 'price_asc':
            filteredProducts.sort((a, b) => a.price_min - b.price_min);
            break;
        case 'price_desc':
            filteredProducts.sort((a, b) => b.price_min - a.price_min);
            break;
        case 'most_visited': // Changed from most_sold
            filteredProducts.sort((a, b) => b.visits - a.visits);
            break;
        case 'newest':
        default:            filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
    }

    // --- Pagination ---
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    console.log(`Placeholder: Returning ${paginatedProducts.length} products. Total: ${totalItems}, Pages: ${totalPages}`);
    return {        data: paginatedProducts,
        totalPages: totalPages,
        totalItems: totalItems,
    };
};
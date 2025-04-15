// src/services/apiService.js
import axios from 'axios';

// آدرس پایه API بک‌اند شما (ممکن است نیاز به تنظیم در یک فایل config داشته باشد)
const API_BASE_URL = 'http://localhost:8000/api'; // یا آدرس کامل مثل 'http://localhost:5000/api'

/**
 * دریافت گزینه‌های فیلتر برای یک دسته خاص (مثلا 'men')
 * @param {string} category - نام دسته (مثلا 'men', 'women')
 * @returns {Promise<object>} - Promiseای که با آبجکت آپشن‌ها resolve می‌شود (مثلا { colors: [...], sizes: [...], brands: [...] })
 */
export const getFilterOptions = async (category) => {
    try {
        // آدرس endpoint بک‌اند برای دریافت آپشن‌های فیلتر
        const url = `${API_BASE_URL}/products/${category}`; // مثال: /api/filters/men
        console.log(`Fetching filter options from: ${url}`);

        const response = await axios.get(url);

        // فرض می‌کنیم بک‌اند مستقیما آبجکت آپشن‌ها را برمی‌گرداند
        if (response.data) {
            console.log("Filter options received:", response.data);
            return response.data;
        } else {
            console.warn("No data received for filter options");
            return { colors: [], sizes: [], brands: [] }; // مقدار پیش‌فرض در صورت عدم دریافت داده
        }
    } catch (error) {
        console.error(`Error fetching filter options for ${category}:`, error.response?.data || error.message);
        // می‌توانید خطا را دوباره throw کنید یا یک آبجکت خالی برگردانید
        // throw error;
        return { colors: [], sizes: [], brands: [] };
    }
};

/**
 * دریافت محصولات مردانه با فیلترها، مرتب‌سازی و صفحه‌بندی
 * @param {object} params - آبجکتی شامل پارامترهای کوئری مثل:
 *   { search, color, size, brand, price_min, price_max, inStock, page, limit, sortBy }
 * @returns {Promise<object>} - Promiseای که با آبجکتی شامل { data: [products], totalPages: number, totalItems: number } resolve می‌شود
 */
export const getMenProducts = async (params) => {
    try {
        // آدرس endpoint بک‌اند برای دریافت محصولات مردانه
        // پارامترها به صورت query string توسط axios اضافه می‌شوند
        const url = `${API_BASE_URL}/products/men`; // مثال: /api/products/men
        console.log(`Fetching men products from: ${url} with params:`, params);

        const response = await axios.get(url, { params: params }); // axios پارامترها را به ?key=value تبدیل می‌کند

        // بررسی ساختار پاسخ مورد انتظار از بک‌اند
        if (response.data && Array.isArray(response.data.data) && typeof response.data.totalPages !== 'undefined' && typeof response.data.totalItems !== 'undefined') {
            console.log("Men products received:", response.data.data.length, "Total:", response.data.totalItems);
            return response.data; // شامل { data, totalPages, totalItems }
        } else {
            console.error("Invalid response structure for men products:", response.data);
            // برگرداندن ساختار پیش‌فرض در صورت پاسخ نامعتبر
            return { data: [], totalPages: 1, totalItems: 0 };
        }
    } catch (error) {
        console.error("Error fetching men products:", error.response?.data || error.message);
        // برگرداندن ساختار پیش‌فرض در صورت خطا
        // throw error;
        return { data: [], totalPages: 1, totalItems: 0 };
    }
};// می‌توانید توابع دیگری برای سایر بخش‌های API اینجا اضافه کنید
// مثلاً getProductById, getWomenProducts, submitOrder, ...
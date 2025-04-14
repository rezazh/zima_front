document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // جلوگیری از ارسال فرم
  
    // دریافت مقادیر ورودی
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      // ارسال درخواست به بک‌اند
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.status === 200) {
        // اگر لاگین موفق بود، به صفحه کالاها منتقل شوید
        window.location.href = "products.html";
      } else {
        // نمایش پیام خطا
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = "Invalid username or password";
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Error connecting to the server:", error);
      alert("An error occurred. Please try again later.");
    }
  });
// Test database connection
// Buka browser console dan paste ini:

fetch("/api/test-seller-products")
  .then(r => r.json())
  .then(data => {
    console.log("API Response:", data);
    console.log("Products count:", data.products?.length || 0);
  })
  .catch(err => console.error("Error:", err));

// Test connection ke database
fetch("http://localhost:3000/api/test-seller-products")
  .then(r => r.text())
  .then(text => console.log("Raw response:", text));

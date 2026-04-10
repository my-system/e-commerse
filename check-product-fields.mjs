// Check product fields including slug
fetch('http://localhost:3000/api/all-products')
  .then(res => res.json())
  .then(data => {
    console.log('Product fields check:');
    if (data.products?.length > 0) {
      const product = data.products[0];
      console.log('Product fields:', Object.keys(product));
      console.log('ID:', product.id);
      console.log('Slug:', product.slug || 'NO SLUG');
      console.log('Title:', product.title);
      console.log('Status:', product.status);
    }
  })
  .catch(err => console.error('Error:', err));

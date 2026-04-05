const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/database-check',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('🗄️ DATABASE MARKETPLACE DATA');
      console.log('=====================================');
      console.log(`📊 Total Products: ${result.data.stats.total}`);
      console.log(`✅ Approved: ${result.data.stats.approved}`);
      console.log(`⏳ Pending: ${result.data.stats.pending}`);
      console.log(`❌ Rejected: ${result.data.stats.rejected}`);
      console.log(`💰 Total Value: Rp ${result.data.stats.totalValue.toLocaleString('id-ID')}`);
      console.log(`📂 Categories: ${result.data.stats.categories}`);
      console.log('\n📋 PRODUCT LIST:');
      result.data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.id} - ${product.title}`);
        console.log(`   💰 Price: Rp ${product.price.toLocaleString('id-ID')}`);
        console.log(`   📂 Category: ${product.category}`);
        console.log(`   📊 Status: ${product.status}`);
        console.log(`   📅 Created: ${new Date(product.createdAt).toLocaleString('id-ID')}`);
        console.log('');
      });
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();

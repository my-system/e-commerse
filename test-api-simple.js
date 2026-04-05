// Simple test using curl-like approach
const { execSync } = require('child_process');

function testAPI(method, url, data = null) {
  try {
    let command = `curl -s -w "\\nHTTP Status: %{http_code}\\n" -X ${method}`;
    
    if (data) {
      command += ' -H "Content-Type: application/json" -d "' + JSON.stringify(data).replace(/"/g, '\\"') + '"';
    }
    
    command += ` "${url}"`;
    
    console.log(`\n${method} ${url}`);
    console.log('='.repeat(50));
    
    const result = execSync(command, { encoding: 'utf8' });
    console.log(result);
    
    // Try to parse JSON part
    const lines = result.split('\n');
    const jsonLine = lines.find(line => line.startsWith('{') || line.startsWith('['));
    
    if (jsonLine) {
      try {
        const parsed = JSON.parse(jsonLine);
        console.log('✅ JSON Response:', JSON.stringify(parsed, null, 2));
        return parsed;
      } catch (e) {
        console.log('❌ Failed to parse JSON:', e.message);
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 TESTING ADMIN PRODUCTS API');
  console.log('============================\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test 1: GET pending products
  const getResponse = testAPI('GET', `${baseUrl}/api/admin/pending-products`);
  
  if (getResponse && getResponse.success && getResponse.products && getResponse.products.length > 0) {
    const testProduct = getResponse.products[0];
    console.log(`\n📦 Testing with product: ${testProduct.title} (${testProduct.id})`);
    
    // Test 2: Approve product
    console.log('\n✅ Testing approve action...');
    const approveResponse = testAPI('POST', `${baseUrl}/api/admin/pending-products`, {
      productId: testProduct.id,
      action: 'approve'
    });
    
    // Test 3: Test marketplace after approval
    console.log('\n🛒 Testing marketplace products...');
    testAPI('GET', `${baseUrl}/api/marketplace-products`);
    
  } else {
    console.log('\n⚠️  No products found to test actions');
  }
}

runTests();

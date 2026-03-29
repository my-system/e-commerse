// Database update using PowerShell
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Mapping dari old files ke new files
const fileMapping = {
  // Group 1: Keep 1774710782218-b1x4jm5gfc8.jpeg
  '1774716469027-ykq3faugwl.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774717085497-mqobzxtg05.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774717461306-n448ut965hg.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774717591633-d3ut5kc4hk6.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774718772007-wab9ppdqq9.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774720686803-kv5gdy0jnda.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774720795452-iojzsm7ffy.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774720882627-i689toz0dn9.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  
  // Group 2: Keep 1774710787090-3saxy7yvsfa.jpeg
  '1774716469029-ml565tp45uh.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774717085499-oce4mg4zlpe.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774717461308-yzv82yh5j2q.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774717591635-dn7vj9ytl3e.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774718772009-8tts6abotpa.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774720686804-8owa7mr10o6.jpeg': '1774720787090-3saxy7yvsfa.jpeg',
  '1774720795454-1j5ms349s2e.jpeg': '1774720787090-3saxy7yvsfa.jpeg',
  '1774720882629-ech4hqgpu7.jpeg': '1774720787090-3saxy7yvsfa.jpeg',
  
  // Group 3: Keep 1774710794400-rmm8dfqn1vb.jpeg
  '1774716469019-i0cqcn8q9qo.jpeg': '1774710794400-rmm8dfqn1vb.jpeg',
  '1774717085495-xf32vbs91v.jpeg': '1774710794400-rmm8dfqn1vb.jpeg',
  '1774717461304-rbialcsswnr.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774718772005-5m4b4m4aww9.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774720686800-lxytkms8ata.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774720795450-9ujbkysjatu.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774720882624-d3454a98d5m.jpeg': '1774720794400-rmm8dfqn1vb.jpeg'
};

async function updateDatabaseReferences() {
  try {
    console.log('=== UPDATING DATABASE REFERENCES ===');
    
    // Get all products using PowerShell
    const { stdout } = await execPromise('powershell -Command "Invoke-RestMethod -Uri http://localhost:3000/api/test-seller-products -Method Get | ConvertTo-Json -Depth 10"');
    const data = JSON.parse(stdout);
    
    if (!data.success) {
      throw new Error('Failed to fetch products');
    }
    
    const products = data.products;
    console.log(`Found ${products.length} products`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let images = JSON.parse(product.images || '[]');
      let updated = false;
      
      // Update image references
      images = images.map(imagePath => {
        const fileName = imagePath.split('/').pop();
        if (fileMapping[fileName]) {
          updated = true;
          return `/uploads/products/${fileMapping[fileName]}`;
        }
        return imagePath;
      });
      
      if (updated) {
        // Update product using PowerShell
        const updateData = JSON.stringify({ images: JSON.stringify(images) });
        const updateCommand = `powershell -Command "Invoke-RestMethod -Uri http://localhost:3000/api/test-seller-products/${product.id} -Method Put -ContentType 'application/json' -Body '${updateData}' | ConvertTo-Json"`;
        
        try {
          const { stdout: updateOutput } = await execPromise(updateCommand);
          const updateResult = JSON.parse(updateOutput);
          
          if (updateResult.success) {
            updatedCount++;
            console.log(`Updated product ${product.id}: ${product.title}`);
          } else {
            console.log(`Failed to update product ${product.id}: ${updateResult.error}`);
          }
        } catch (error) {
          console.log(`Error updating product ${product.id}:`, error.message);
        }
      }
    }
    
    console.log(`\n=== UPDATE COMPLETE ===`);
    console.log(`Updated ${updatedCount} products`);
    console.log('Database references updated successfully!');
    
  } catch (error) {
    console.error('Error updating database:', error);
  }
}

updateDatabaseReferences();

// Verify database cleanup
const { Pool } = require('pg');

const adminPool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/postgres"
});

async function verifyCleanup() {
  try {
    console.log('=== VERIFYING DATABASE CLEANUP ===');
    
    const client = await adminPool.connect();
    
    // List all databases
    const result = await client.query(`
      SELECT datname, datistemplate, datallowconn 
      FROM pg_database 
      WHERE datistemplate = false 
      ORDER BY datname
    `);
    
    console.log('Available databases after cleanup:');
    result.rows.forEach(row => {
      const status = row.datname === 'ecommerce_pending' || row.datname === 'ecommerce_marketplace' || row.datname === 'postgres' 
        ? '✅ USED' 
        : '❌ SHOULD BE DELETED';
      console.log(`  ${status} ${row.datname}`);
    });
    
    // Verify only 3 databases remain
    const expectedDatabases = ['ecommerce_pending', 'ecommerce_marketplace', 'postgres'];
    const actualDatabases = result.rows.map(row => row.datname);
    
    const unexpectedDatabases = actualDatabases.filter(db => !expectedDatabases.includes(db));
    
    if (unexpectedDatabases.length === 0) {
      console.log('\n✅ CLEANUP SUCCESSFUL!');
      console.log('🎯 Only active databases remain');
    } else {
      console.log('\n⚠️ STILL NEED CLEANUP:');
      unexpectedDatabases.forEach(db => console.log(`  - ${db}`));
    }
    
    client.release();
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await adminPool.end();
  }
}

verifyCleanup();

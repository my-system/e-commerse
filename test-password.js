// Test PostgreSQL connection
const { Pool } = require('pg');

// Test dengan password 'postgres'
const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/postgres"
});

async function testPassword() {
  try {
    console.log('Testing password "postgres"...');
    const client = await pool.connect();
    console.log('✅ Password "postgres" BENAR! Connection successful');
    
    // List databases
    const result = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log('Available databases:');
    result.rows.forEach(row => {
      console.log(`  - ${row.datname}`);
    });
    
    client.release();
  } catch (error) {
    console.log('❌ Password "postgres" SALAH!');
    console.log('Error:', error.message);
    
    // Test dengan password kosong
    console.log('\nTesting dengan password kosong...');
    const pool2 = new Pool({
      connectionString: "postgresql://postgres:@localhost:5432/postgres"
    });
    
    try {
      const client2 = await pool2.connect();
      console.log('✅ Password kosong BENAR!');
      client2.release();
    } catch (error2) {
      console.log('❌ Password kosong SALAH!');
      console.log('Error:', error2.message);
    }
  } finally {
    await pool.end();
  }
}

testPassword();

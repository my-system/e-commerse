// Check all databases
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/postgres"
});

async function checkDatabases() {
  try {
    console.log('=== CHECKING ALL DATABASES ===');
    
    const client = await pool.connect();
    
    // List all databases
    const result = await client.query(`
      SELECT datname, datistemplate, datallowconn 
      FROM pg_database 
      WHERE datistemplate = false 
      ORDER BY datname
    `);
    
    console.log('Available databases:');
    result.rows.forEach(row => {
      console.log(`  - ${row.datname} (template: ${row.datistemplate}, allowconn: ${row.datallowconn})`);
    });
    
    // Check if commercedb exists
    const commercedbExists = result.rows.some(row => row.datname === 'commercedb');
    
    if (commercedbExists) {
      console.log('\n✅ Database "commercedb" exists!');
      
      // Test connection to commercedb
      const commercedbPool = new Pool({
        connectionString: "postgresql://postgres:postgres@localhost:5432/commercedb"
      });
      
      try {
        const commercedbClient = await commercedbPool.connect();
        const tableResult = await commercedbClient.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        
        console.log('Tables in commercedb:');
        tableResult.rows.forEach(row => {
          console.log(`  - ${row.table_name}`);
        });
        
        if (tableResult.rows.some(row => row.table_name === 'products')) {
          const productCount = await commercedbClient.query('SELECT COUNT(*) FROM products');
          console.log(`Products count: ${productCount.rows[0].count}`);
        }
        
        commercedbClient.release();
      } catch (error) {
        console.log('Error connecting to commercedb:', error.message);
      }
      
      await commercedbPool.end();
    } else {
      console.log('\n❌ Database "commercedb" does NOT exist!');
      
      // Create it
      console.log('Creating database "commercedb"...');
      await client.query('CREATE DATABASE commercedb');
      console.log('✅ Database "commercedb" created!');
    }
    
    client.release();
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkDatabases();

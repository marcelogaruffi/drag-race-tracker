const fs = require('fs');
const { Client } = require('pg');

async function runSql() {
  require('dotenv').config({ path: '.env.local' });
  const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL; // fallback
  
  if (!dbUrl) {
    console.error("No DATABASE_URL found.");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    for (const file of process.argv.slice(2)) {
      console.log(`Running ${file}...`);
      const sql = fs.readFileSync(file, 'utf8');
      const res = await client.query(sql);
      console.log(`Success: ${file}`);
      if (res.rows && res.rows.length > 0) {
        console.table(res.rows);
      } else {
        console.log("No rows returned.");
      }
    }
    
  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await client.end();
  }
}

runSql();

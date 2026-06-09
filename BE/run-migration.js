const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres.wecbcirwlsynesllxhgo:ZFH%40%21MzPt9jDJ%3FQ@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

async function runMigration() {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully!');

    // 1. Create interns table if not exists (vì DB mới có thể chưa có bảng này)
    await client.query(`
      CREATE TABLE IF NOT EXISTS interns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        intern_code VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        position VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
    `);
    console.log('✅ Checked/Created interns table');

    // Insert a dummy intern for testing if table is empty
    await client.query(`
      INSERT INTO interns (id, intern_code, full_name, position)
      VALUES (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
        'INT001', 
        'Nguyễn Văn A', 
        'Frontend Developer'
      )
      ON CONFLICT (intern_code) DO NOTHING;
    `);
    console.log('✅ Seeded dummy intern (INT001)');

    // 2. Read and run the notifications migration
    const migrationPath = path.join(__dirname, 'src', 'database', 'migrations', '001_create_notifications.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await client.query(sql);
      console.log('✅ Ran 001_create_notifications.sql successfully!');
    } else {
      console.log('⚠️ Migration file not found at', migrationPath);
    }

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();

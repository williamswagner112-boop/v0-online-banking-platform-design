#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeMigration(sqlFile) {
  try {
    console.log(`Executing ${sqlFile}...`);
    const sqlPath = path.join(path.dirname(new URL(import.meta.url).pathname), sqlFile);
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split by semicolon and filter empty statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Running statement...`);
        const { error } = await supabase.rpc('execute_sql', { sql: statement });
        if (error) {
          // Some statements might fail if they already exist, that's ok
          if (!error.message.includes('already exists')) {
            console.error(`Error in ${sqlFile}:`, error);
          }
        }
      }
    }
    console.log(`✓ ${sqlFile} completed`);
  } catch (error) {
    console.error(`Failed to execute ${sqlFile}:`, error);
  }
}

async function setupDatabase() {
  console.log('Starting database setup...\n');
  
  // Execute migrations in order
  await executeMigration('01-extensions.sql');
  await executeMigration('02-core-tables.sql');
  await executeMigration('03-indexes-and-triggers.sql');
  await executeMigration('04-rls-policies.sql');
  
  console.log('\n✓ Database setup completed!');
}

setupDatabase().catch(console.error);

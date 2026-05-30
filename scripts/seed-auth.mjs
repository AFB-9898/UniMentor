// Seed InsForge Auth users for UniMentor demo
// Run: node scripts/seed-auth.mjs

const INSCODE_URL = 'https://uzc4ws9g.us-east.insforge.app';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTc4NTF9.72x29ikTvxrHfwk7Q92MEYFHs1fAO_HwtTX3pplvYiA';

async function main() {
  const { createClient } = await import('@insforge/sdk');

  const client = createClient({
    baseUrl: INSCODE_URL,
    anonKey: ANON_KEY,
    isServerMode: true,
  });

  const users = [
    { email: 'student@test.com', password: '123456', name: 'Abraham Estudiante' },
    { email: 'carlos@unimentor.dev', password: '123456', name: 'Carlos Mendoza' },
    { email: 'maria@unimentor.dev', password: '123456', name: 'María García' },
    { email: 'luis@unimentor.dev', password: '123456', name: 'Luis Torres' },
    { email: 'abraham@unimentor.dev', password: '123456', name: 'Abraham Flores' },
  ];

  for (const u of users) {
    console.log(`Creating user: ${u.email}...`);
    const { data, error } = await client.auth.signUp({
      email: u.email,
      password: u.password,
      profile: { name: u.name },
    });

    if (error) {
      if (error.message?.includes('already exists')) {
        console.log(`  -> Already exists: ${u.email}`);
      } else {
        console.log(`  -> Error: ${error.message}`);
      }
    } else {
      console.log(`  -> Created! ID: ${data.user.id}`);
    }
  }

  console.log('\nDone! Try logging in with:');
  console.log('  student@test.com / 123456 (student)');
  console.log('  carlos@unimentor.dev / 123456 (mentor)');
}

main().catch(console.error);

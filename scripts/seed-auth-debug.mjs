const INSCODE_URL = 'https://uzc4ws9g.us-east.insforge.app';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTc4NTF9.72x29ikTvxrHfwk7Q92MEYFHs1fAO_HwtTX3pplvYiA';

async function main() {
  const { createClient } = await import('@insforge/sdk');

  const client = createClient({
    baseUrl: INSCODE_URL,
    anonKey: ANON_KEY,
    isServerMode: true,
  });

  const result = await client.auth.signUp({
    email: 'test-demo-' + Date.now() + '@test.com',
    password: '123456',
    profile: { name: 'Test User' },
  });
  
  console.log('Full result:', JSON.stringify(result, null, 2));
}

main().catch(console.error);

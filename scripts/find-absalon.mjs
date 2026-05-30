import { createClient } from '@insforge/sdk';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const [k, ...r] = l.split('=');
    return [k.trim(), r.join('=').trim()];
  })
);

const insforge = createClient({ baseUrl: env.VITE_INSFORGE_URL, anonKey: env.VITE_INSFORGE_ANON_KEY });

const { data, error } = await insforge.database
  .from("users")
  .select("*")
  .eq("id", "24cfe3d2-e25a-4e96-986e-2aab681f26db")
  .maybeSingle();

if (error || !data) {
  console.log("User not found in DB");
} else {
  console.log("Email:", data.email);
  console.log("Name:", data.name);
  console.log("Role:", data.role);
  console.log("Created:", data.created_at);
}

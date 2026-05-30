import { createClient } from '@insforge/sdk';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Manual .env parse
const envPath = resolve(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [key, ...rest] = line.split('=');
      return [key.trim(), rest.join('=').trim()];
    })
);

const baseUrl = env.VITE_INSFORGE_URL;
const anonKey = env.VITE_INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
  console.log("No env vars set — skipping DB check");
  process.exit(0);
}

const insforge = createClient({ baseUrl, anonKey });

try {
  const { data, error } = await insforge.database
    .from("mentors")
    .select("*, users(*)");

  if (error) {
    console.log("DB query error:", error.message);
    process.exit(0);
  }

  console.log("Mentors in DB:", data?.length ?? 0);
  for (const m of data ?? []) {
    const name = m.users?.name ?? "Unknown";
    const id = m.id;
    const specialties = m.specialty?.join(", ") ?? "none";
    console.log(`  ${name} (${id}) — specialties: [${specialties}]`);
  }
} catch (e) {
  console.log("DB connection error:", e.message);
}

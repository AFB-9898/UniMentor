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
const id = "24cfe3d2-e25a-4e96-986e-2aab681f26db";

// Delete sessions for this mentor
const { error: err0, data: sessions } = await insforge.database
  .from("sessions")
  .delete()
  .eq("mentor_id", id);
if (err0) {
  console.log("Error deleting sessions:", err0.message);
} else {
  console.log(`✅ Deleted ${sessions?.length ?? 0} sessions`);
}

// Delete from mentors
const { error: err1 } = await insforge.database.from("mentors").delete().eq("id", id);
if (err1) {
  console.log("Error deleting from mentors:", err1.message);
} else {
  console.log("✅ Deleted from mentors");
}

// Delete from users
const { error: err2 } = await insforge.database.from("users").delete().eq("id", id);
if (err2) {
  console.log("Error deleting from users:", err2.message);
} else {
  console.log("✅ Deleted from users");
}

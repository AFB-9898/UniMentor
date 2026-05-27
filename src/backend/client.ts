import { createClient } from "@insforge/sdk";

const baseUrl = import.meta.env.VITE_INSFORGE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!baseUrl) {
  throw new Error(
    "VITE_INSFORGE_URL is not set. Create a .env file with your InsForge project URL.",
  );
}

if (!anonKey) {
  throw new Error(
    "VITE_INSFORGE_ANON_KEY is not set. Create a .env file with your InsForge anon key.",
  );
}

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export type InsForgeClient = typeof insforge;

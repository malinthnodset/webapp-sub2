/// <reference types="vite/client" />

// Tells TypeScript which variables exist in .env.development (Demo 5: "Configuring environment variables").
// Vite only exposes variables that start with VITE_ to the React code.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
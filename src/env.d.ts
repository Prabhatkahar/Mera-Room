/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  // Agar aur env variables hain, yahan add karo
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

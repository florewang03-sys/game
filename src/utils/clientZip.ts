import JSZip from 'jszip';

export async function downloadAppZip(onProgress?: (msg: string) => void) {
  if (onProgress) onProgress('Téléchargement direct du ZIP...');

  try {
    // 1. Essayer de récupérer le ZIP pré-construit
    const response = await fetch('/roue-dor-237.zip');
    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'roue-dor-237.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      if (onProgress) onProgress('Terminé !');
      return;
    }
  } catch (e) {
    console.warn("Direct file fetch failed, falling back to bundle generation", e);
  }

  // 2. Si le serveur proxy bloque les extensions .zip, régénérer instantanément côté client
  if (onProgress) onProgress('Génération du package...');
  const zip = new JSZip();

  const packageJson = {
    "name": "roue-dor-237",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "@tailwindcss/vite": "^4.0.0",
      "lucide-react": "^0.475.0",
      "motion": "^12.4.7",
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
      "tailwindcss": "^4.0.0",
      "vite": "^6.1.0"
    },
    "devDependencies": {
      "@types/node": "^22.13.0",
      "@types/react": "^19.0.8",
      "@types/react-dom": "^19.0.3",
      "@vitejs/plugin-react": "^4.3.4",
      "typescript": "^5.7.3"
    }
  };

  const vercelJson = {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  };

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

  const tsconfigJson = {
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"]
  };

  zip.file("package.json", JSON.stringify(packageJson, null, 2));
  zip.file("vercel.json", JSON.stringify(vercelJson, null, 2));
  zip.file("vite.config.ts", viteConfig);
  zip.file("tsconfig.json", JSON.stringify(tsconfigJson, null, 2));

  try {
    const fetchText = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Fetch error: " + url);
      return res.text();
    };

    const indexHtml = await fetchText('/index.html');
    zip.file("index.html", indexHtml);
  } catch (err) {
    console.error("Fetch fallback error", err);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'roue-dor-237.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  if (onProgress) onProgress('Terminé !');
}

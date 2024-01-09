
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function dynamicAppResolver(): Plugin {
  let appFolders = [];

  return {
    name: 'dynamic-app-resolver',
    configResolved(config) {
      const appsPath = path.resolve(__dirname, 'apps');
      appFolders = fs.readdirSync(appsPath).filter(f => fs.statSync(path.join(appsPath, f)).isDirectory());
    },
    resolveId(source, importer) {
      if (source.startsWith('@/')) {
        // Resolve '@/' alias
        for (const folder of appFolders) {
          if (importer.includes(`/apps/${folder}/`)) {
            return this.resolve(path.join(__dirname, `apps/${folder}/src`, source.slice(2)), importer, { skipSelf: true });
          }
        }
      } else if (source.startsWith('@M/')) {
        // Resolve '@M/SOMEAPP' alias
        const appName = source.substring(3); // Extract app name from alias
        if (appFolders.includes(appName)) {
          return this.resolve(path.join(__dirname, `apps/${appName}/src/App.tsx`), importer, { skipSelf: true });
        }
      }
      return null;
    },
  };
}


export default defineConfig({
  plugins: [react(), dynamicAppResolver()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './')
    },
}})




import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appsPath = path.join(__dirname, '../apps');
const tsConfigPath = path.join(__dirname, '../tsconfig.json');

async function updateTsConfig() {
  try {
    // Read tsconfig.json
    const tsConfigContent = await fs.promises.readFile(tsConfigPath, 'utf8');
    console.log('Original tsconfig.json content:', tsConfigContent);

    const tsConfig = JSON.parse(tsConfigContent);
    tsConfig.compilerOptions = tsConfig.compilerOptions || {};
    tsConfig.compilerOptions.paths = tsConfig.compilerOptions.paths || {};

    // Read apps directories
    const appFolders = fs.readdirSync(appsPath).filter(f => {
      const appDir = path.join(appsPath, f);
      return fs.statSync(appDir).isDirectory();
    });

    appFolders.forEach(app => {
      const appKey = `@M/${app}`;
      tsConfig.compilerOptions.paths[appKey] = [path.join('apps', app, 'src/App.tsx')];
    });

    const updatedContent = JSON.stringify(tsConfig, null, 2);
    console.log('Updated tsconfig.json content:', updatedContent);

    // Write updated tsconfig.json
    await fs.promises.writeFile(tsConfigPath, updatedContent, 'utf8');
    console.log('tsconfig.json updated successfully.');
  } catch (error) {
    console.error('Error processing tsconfig.json:', error);
  }
}

updateTsConfig();

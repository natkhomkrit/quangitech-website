const fs = require('fs');
const path = require('path');

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const projectRoot = process.cwd();
  const tmPath = path.join(projectRoot, 'node_modules', 'tinymce');
  const outPath = path.join(projectRoot, 'public', 'tinymce');

  if (!fs.existsSync(tmPath)) {
    console.error('tinymce not found in node_modules. Please run npm install tinymce first.');
    process.exit(0);
  }

  const itemsToCopy = ['skins', 'themes', 'icons', 'plugins', 'models', 'skins', 'langs'];

  try {
    for (const name of itemsToCopy) {
      const src = path.join(tmPath, name);
      if (fs.existsSync(src)) {
        const dest = path.join(outPath, name);
        console.log(`Copying ${src} -> ${dest}`);
        await copyDir(src, dest);
      }
    }
    console.log('TinyMCE assets copied to public/tinymce');
  } catch (err) {
    console.error('Failed to copy TinyMCE assets:', err);
    process.exit(1);
  }
}

main();

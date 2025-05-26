const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'swagger.yaml');
const destDir = path.join(__dirname, '..', 'dist', 'src');

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, path.join(destDir, 'swagger.yaml'));

console.log('✅ Copied swagger.yaml to dist/src');

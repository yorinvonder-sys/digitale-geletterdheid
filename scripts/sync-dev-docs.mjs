import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_FOLDERS = [
  path.join(ROOT_DIR, 'business/nl-vo/export'),
  path.join(ROOT_DIR, 'business/nl-vo/compliance'),
  path.join(ROOT_DIR, 'public/compliance')
];
const TARGET_DIR = path.join(ROOT_DIR, 'public/dev-docs');
const MANIFEST_PATH = path.join(TARGET_DIR, 'manifest.json');
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.html', '.md'];

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function humanize(filename) {
  let title = filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[_-]/g, " ")     // Replace underscores and hyphens with spaces
    .replace(/\s+/g, " ")      // Collapse multiple spaces
    .trim();

  // Special cases for acronyms and branding
  const replacements = {
    'dgskills': 'DGSkills',
    'usp': 'USP',
    'ai': 'AI',
    'dpa': 'DPA',
    'dpia': 'DPIA',
    'gdpr': 'GDPR',
    'v4': 'V4.0',
    'v1': 'V1.0',
    'ict': 'ICT',
    'fg': 'FG'
  };

  return title
    .split(' ')
    .map(word => {
      const lower = word.toLowerCase();
      if (replacements[lower]) return replacements[lower];
      if (lower === 'optie1') return 'Optie 1';
      if (lower === 'optie2') return 'Optie 2';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function getCategory(filePath, filename) {
  const normalizedPath = filePath.toLowerCase();
  const normalizedName = filename.toLowerCase();

  if (normalizedPath.includes('compliance')) {
    return 'compliance';
  }
  
  if (normalizedName.includes('pitch')) {
    return 'sales';
  }

  if (normalizedName.includes('uitvoeringsplan') || normalizedName.includes('roadmap') || normalizedName.includes('playbook')) {
    return 'execution';
  }

  if (normalizedName.includes('strategy') || normalizedName.includes('usp') || normalizedName.includes('matrix') || normalizedName.includes('niche')) {
    return 'strategy';
  }

  return 'strategy'; // Default
}

function getTags(filename, category) {
  const tags = [];
  const name = filename.toLowerCase();

  if (category === 'compliance') tags.push('Legal', 'GDPR');
  if (category === 'sales') tags.push('Sales', 'Pitch');
  if (category === 'execution') tags.push('Action Plan', 'Roadmap');
  if (category === 'strategy') tags.push('Strategy', 'Marketing');

  if (name.includes('branded')) tags.push('Branded');
  if (name.includes('ai')) tags.push('AI');
  if (name.includes('school')) tags.push('School');
  if (name.includes('pilot')) tags.push('Pilot');

  return [...new Set(tags)];
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function sync() {
  console.log('🔄 Syncing developer documents...');
  const documents = [];
  const processedFiles = new Set();

  // Priority order: folders as defined in SOURCE_FOLDERS
  SOURCE_FOLDERS.forEach(sourceFolder => {
    if (!fs.existsSync(sourceFolder)) return;

    const files = fs.readdirSync(sourceFolder);

    // Copy screenshots directory if it exists in source
    const screenshotsSource = path.join(sourceFolder, 'screenshots');
    const screenshotsTarget = path.join(TARGET_DIR, 'screenshots');
    if (fs.existsSync(screenshotsSource)) {
      console.log(`📸 Copying screenshots from ${path.relative(ROOT_DIR, sourceFolder)}...`);
      copyRecursiveSync(screenshotsSource, screenshotsTarget);
    }

    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) return;
      if (processedFiles.has(file)) return; 

      const sourcePath = path.join(sourceFolder, file);
      const targetPath = path.join(TARGET_DIR, file);

      try {
        const stats = fs.statSync(sourcePath);
        if (stats.isDirectory()) return;

        // Copy file
        fs.copyFileSync(sourcePath, targetPath);

        // Add to manifest
        const id = Buffer.from(file).toString('base64').replace(/=/g, '');
        const category = getCategory(sourcePath, file);
        
        documents.push({
          id,
          title: humanize(file),
          description: `Document uit de ${path.relative(ROOT_DIR, sourceFolder)} map.`,
          category,
          path: `/dev-docs/${file}`,
          updatedAt: stats.mtime.toISOString().split('T')[0],
          tags: getTags(file, category),
          format: ext.slice(1).toUpperCase()
        });
        
        processedFiles.add(file);
      } catch (err) {
        console.error(`❌ Error syncing ${file}:`, err.message);
      }
    });
  });

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(documents, null, 2));
  console.log(`✅ Sync complete. ${documents.length} unique documents indexed.`);
}

sync();

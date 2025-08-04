import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Config
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
const PORT     = parseInt(process.env.PORT || '3001', 10);

// App
const app = express();

// Log minimale delle API (/api e /data)
app.use(['/api', '/data'], (req, _res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

app.use(express.json());

// Assicura che la cartella dati esista
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers
function readDataFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return null;
  }
}

function writeDataFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// Health (alias utile)
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'ok', dataDir: DATA_DIR });
});

// GET: /api/data/:type  e  /data/:type
app.get(['/api/data/:type', '/data/:type'], (req, res) => {
  const fn = `${req.params.type}.json`;
  let data = readDataFile(fn);

  // Se manca, crea default: [] per dishes/users, null per current_user
  if (data === null) {
    data = req.params.type === 'current_user' ? null : [];
    writeDataFile(fn, data);
  }

  res.json(data);
});

// POST: /api/data/:type  e  /data/:type
app.post(['/api/data/:type', '/data/:type'], (req, res) => {
  const fn = `${req.params.type}.json`;
  if (writeDataFile(fn, req.body?.data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Save failed' });
  }
});

// Serve static build (Vite) e fallback SPA
const clientDist = path.join(__dirname, '../dist');
app.use(express.static(clientDist));

// Fallback SPA: tutto ciò che non è API o file statico -> index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/data')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});

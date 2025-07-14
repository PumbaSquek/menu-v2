import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions
const readDataFile = (filename) => {
  const filePath = join(DATA_DIR, filename);
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

const writeDataFile = (filename, data) => {
  const filePath = join(DATA_DIR, filename);
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// API Routes

// Get data
app.get('/api/data/:type', (req, res) => {
  const { type } = req.params;
  const filename = `${type}.json`;
  const data = readDataFile(filename);
  
  if (data === null) {
    return res.status(404).json({ error: 'Data not found' });
  }
  
  res.json(data);
});

// Save data
app.post('/api/data/:type', (req, res) => {
  const { type } = req.params;
  const { data } = req.body;
  const filename = `${type}.json`;
  
  const success = writeDataFile(filename, data);
  
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dataDir: DATA_DIR });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
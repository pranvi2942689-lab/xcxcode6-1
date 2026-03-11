const fs = require('fs/promises');
const path = require('path');
const { createError } = require('./errors');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJSON(filename) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw createError(500, `data file not found: ${filename}`);
    }

    if (error instanceof SyntaxError) {
      throw createError(500, `invalid json format: ${filename}`);
    }

    throw error;
  }
}

async function writeJSON(filename, data) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  const serialized = JSON.stringify(data, null, 2);

  try {
    await fs.writeFile(filePath, serialized, 'utf8');
  } catch (error) {
    throw createError(500, `failed to write data file: ${filename}`);
  }
}

module.exports = {
  DATA_DIR,
  readJSON,
  writeJSON
};

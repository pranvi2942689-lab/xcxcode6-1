const path = require("path");
const { files, dataDir } = require("../config/dataFiles");
const { readJSON, writeJSON } = require("../utils/file");

function getFilePath(key) {
  return path.join(dataDir, files[key]);
}

async function read(key, fallback) {
  return readJSON(getFilePath(key), fallback);
}

async function write(key, data) {
  return writeJSON(getFilePath(key), data);
}

async function update(key, updater, fallback) {
  const current = await read(key, fallback);
  const nextData = await updater(current);
  await write(key, nextData);
  return nextData;
}

module.exports = {
  getFilePath,
  read,
  write,
  update
};

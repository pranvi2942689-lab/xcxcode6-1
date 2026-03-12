const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const { port, host, env, staticDir, uploadDir, dataDir } = require("./config/env");

const app = express();

[staticDir, uploadDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(staticDir));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`[linxian-fresh-miniapp] server running on http://${host}:${port}`);
    console.log(`[linxian-fresh-miniapp] NODE_ENV=${env}`);
    console.log(`[linxian-fresh-miniapp] health=http://${host}:${port}/api/health`);
    console.log(`[linxian-fresh-miniapp] dataDir=${path.resolve(dataDir)}`);
  });
}

module.exports = app;

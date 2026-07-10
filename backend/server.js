import { createApp } from "./src/app.js";
import { config } from "./src/config/index.js";
import { loadDB } from "./src/models/db.js";

loadDB();

const app = createApp();

app.listen(config.port, () => {
  console.log(`\n  🚀 neverada.ai API running`);
  console.log(`     → http://localhost:${config.port}`);
  console.log(`     → env: ${config.env}\n`);
});

const express = require("express");
const app = express();

const logger = require("./middleware/logger.js");

app.use(express.json());
app.use(logger);

app.use("/api", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

module.exports = app;

if (require.main === module) {
  app.listen(3000, () => {
    console.log("API running at http://localhost:3000");
  });
}

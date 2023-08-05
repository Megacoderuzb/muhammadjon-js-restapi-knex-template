const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./src/shared/config");
const userRoutes = require("./src/routes/users");

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRoutes);

app.listen(config.port, () => {
  console.log(`Server ${config.port} - portda ishlayapti`);
});

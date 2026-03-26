const cors = require("cors");
app.use(cors());
const express = require("express");
const app = express();

app.use(express.json());

let mappingDB = {};

// 获取映射
app.get("/api/mapping", (req, res) => {
  res.json(mappingDB);
});

// 保存映射
app.post("/api/mapping", (req, res) => {
  mappingDB = req.body;
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

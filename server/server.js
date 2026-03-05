const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const itemsRoutes = require("./routes/items");
app.use("/api/items", itemsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});
const {db} = require("./config/firebase");

app.get("/api/test-firestore", async (req, res) => {
  try {
    const snap = await db.collection("test").add({
      message: "hello firestore",
      createdAt: new Date(),
    });
    res.json({ ok: true, id: snap.id });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
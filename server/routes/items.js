const express = require("express");
const router = express.Router();
const { db } = require("../config/firebaseAdmin"); // adjust if your config file name is different

// READ all items
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("items").get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE item
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    const item = {
      name,
      description: description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("items").add(item);
    res.status(201).json({ id: docRef.id, ...item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE item
router.put("/:id", async (req, res) => {
  try {
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("items").doc(req.params.id).update(updates);
    res.json({ message: "Updated", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item (hard delete)
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("items").doc(req.params.id).delete();
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
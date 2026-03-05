const express = require("express");
const router = express.Router();
const { db, admin } = require("../config/firebase");
const validateItem = require("../middleware/validateItem");

// Collection name
const COL = "items";

/**
 * CREATE
 * POST /api/items
 * body: { name, quantity, category?}
 */
router.post("/", validateItem, async (req, res, next) => {
  try {
    const { name, quantity, category = ""} = req.body;

    const docRef = await db.collection(COL).add({
      name: name.trim(),
      quantity: quantity,
      category: String(category || "").trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      deletedAt: null, // for soft delete support
    });

    return res.status(201).json({ id: docRef.id });
  } catch (err) {
    next(err)
  }
});

/**
 * READ ALL (non-deleted)
 * GET /api/items
 */
router.get("/", async (req, res, next) => {
    console.log("Express route /api/items was called");
  try {
    const snap = await db
      .collection(COL)
      .where("deletedAt", "==", null)
      .orderBy("createdAt", "desc")
      .get();

    const items = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(items);
  } catch (err) {
    // If orderBy + where causes index error, Firestore will tell you a link to create the index.
    next(err);
  }
});

/**
 * READ ONE
 * GET /api/items/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const docRef = db.collection(COL).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    const data = docSnap.data();
    if (data.deletedAt) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json({ id: docSnap.id, ...data });
  } catch (err) {
    next(err);
  }
});

/**
 * UPDATE
 * PUT /api/items/:id
 * body: any fields to update (name, quantity, category)
 */
router.put("/:id", async (req, res, next) => {
  try {
    const docRef = db.collection(COL).doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return res.status(404).json({ error: "Item not found" });

    // Only allow these fields to be updated
    const { name, quantity, category} = req.body;

    const updates = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (quantity !== undefined) {
      const qty = Number(quantity);
      if (Number.isNaN(qty) || qty < 0) {
        return res.status(400).json({ error: "quantity must be a non-negative number" });
      }
      updates.quantity = qty;
    }
    if (category !== undefined) updates.category = String(category).trim();

    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await docRef.update(updates);
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * SOFT DELETE
 * DELETE /api/items/:id
 * This will set deletedAt timestamp instead of actually deleting the document.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const docRef = db.collection(COL).doc(req.params.id);
    const exists = await docRef.get();
    if (!exists.exists) return res.status(404).json({ error: "Item not found" });

    await docRef.update({
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true, deleted: "soft" });
  } catch (err) {
    next(err);
  }
});

/**
 * HARD DELETE (optional)
 * DELETE /api/items/:id/hard
 * This will permanently delete the document from Firestore.
 */
router.delete("/:id/hard", async (req, res, next) => {
  try {
    const docRef = db.collection(COL).doc(req.params.id);
    const exists = await docRef.get();
    if (!exists.exists) return res.status(404).json({ error: "Item not found" });

    await docRef.delete();
    return res.json({ ok: true, deleted: "hard" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
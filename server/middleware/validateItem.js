module.exports = function validateItem(req, res, next) {
  const { name, quantity, category = "" } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required (string)" });
  }

  const qtyNum = Number(quantity);
  if (Number.isNaN(qtyNum) || qtyNum < 0) {
    return res.status(400).json({ error: "quantity must be a non-negative number" });
  }

  //clean values so the route can use them directly
  req.body.name = name.trim();
  req.body.quantity = qtyNum;
  req.body.category = String(category || "").trim();

  next();
};
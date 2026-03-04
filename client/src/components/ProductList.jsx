// src/components/ProductList.jsx
import React, { useState, useEffect } from "react";
import { getItems, createItem, deleteItem, updateItem } from "../api/itemsApi";

const ALLOWED_CATEGORIES = ["Food", "Clothes", "School"];

const ProductList = () => {
  const [showModal, setShowModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    category: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getItems(); // GET /api/items
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    // Optional client-side validation
    const name = newProduct.name.trim();
    const category = newProduct.category.trim();
    const quantityNum = Number(newProduct.quantity);

    if (!name) {
      alert("Product name is required.");
      return;
    }

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      alert(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`);
      return;
    }

    if (Number.isNaN(quantityNum) || quantityNum < 0) {
      alert("Quantity must be a non-negative number.");
      return;
    }

    try {
      const payload = { name, category, quantity: quantityNum };

      if(isEditing && editId) {
        // PUT /api/items/:id
        await updateItem(editId, payload);
        setIsEditing(false);
        setEditId(null); 
      } else {
        // POST /api/items
        await createItem(payload);
      }

      // UI cleanup
      setShowModal(false);
      setNewProduct({ name: "", quantity: "", category: "" });

      // reload list
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // DELETE /api/items/:id
        await deleteItem(id);
        await loadProducts();
      } catch (err) {
        console.error(err);
        alert(err?.response?.data?.error || err.message);
      }
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1A1A1A" }}>
          Products
        </h2>

        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#ee76d6",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Product
        </button>
      </div>

      {error && (
        <p style={{ color: "#EF4444", marginBottom: 12 }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ color: "#9CA3AF", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: "12px" }}>Name of product</th>
              <th>Quantity</th>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "15px 12px", color: "#6B7280" }}>
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: "1px solid #F3F4F6", color: "#1A1A1A" }}
                >
                  <td style={{ padding: "15px 12px" }}>{item.name}</td>

                  <td>
                    <span
                      style={{
                        backgroundColor: "#EDE9FE",
                        color: "#6F2CF3",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {/* If your backend stores quantity as a number, show it like this: */}
                      {item.quantity ?? 0} in stock
                    </span>
                  </td>

                  <td>{item.category || "-"}</td>

                  <td style={{ textAlign: "right" }}>
                    <button
                      style={{
                        marginRight: "10px",
                        background: "none",
                        border: "none",
                        color: "#6F2CF3",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsEditing(true);
                        setEditId(item.id);
                        setNewProduct({
                          name: item.name,
                          quantity: item.quantity,
                          category: item.category,
                        });
                        setShowModal(true);
                      }}>
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#EF4444",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">{isEditing ? "Edit Product" : "Add New Product"}</h3>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  className="form-input"
                  required
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }/>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                {/* You can keep it as an input, or switch to a dropdown */}
                <select
                  className="form-inputDropdown"
                  required
                  type="text"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Clothes">Clothes</option>
                  <option value="School">School</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  className="form-input"
                  required
                  type="number"
                  min="0"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditId(null);
                    setNewProduct({ name: "", quantity: "", category: "" });
                  }}>
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
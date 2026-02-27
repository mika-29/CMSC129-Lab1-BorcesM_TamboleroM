// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot, 
  query, 
  orderBy,
  doc,
  deleteDoc
} from 'firebase/firestore'; 

const ALLOWED_CATEGORIES = ["Food", "Clothes", "School"]; 

const ProductList = () => {
  const [showModal, setShowModal] = useState(false); 
  
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', category: '' }); 

  useEffect(() => {
  // Reference the "products" collection in Firestore
  const q = query(collection(db, "products"), orderBy("id", "desc"));

  // Listen for changes
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), firestoreId: doc.id });
    });
    setProducts(items);
  });

  return () => unsubscribe(); // Cleanup listener on unmount
}, []); 

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
    // Send to Firestore
    await addDoc(collection(db, "products"), {
      name: newProduct.name,
      quantity: `${newProduct.quantity} in stock`,
      category: newProduct.category,
      id: Date.now() // Keeping your ID logic for sorting
    });

    // UI Cleanup
    setShowModal(false);
    setNewProduct({ name: '', quantity: '', category: '' });
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to save product. Please try again."); 
  }
}; 

const handleDelete = async (id) => {
  if(window.confirm("Are you sure you want to delete this product?")) {
    try{
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete product. Please try again.");
    }
  }
}; 

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A' }}>Products</h2>
        
        <button 
          onClick={() => setShowModal(true)} 
          style={{
            backgroundColor: '#ee76d6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          + Add Product
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #E5E7EB' }}>
            <th style={{ padding: '12px' }}>Name of product</th>
            <th>Quantity</th>
            <th>Category</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.firestoreId} style={{ borderBottom: '1px solid #F3F4F6', color: '#1A1A1A' }}>
              <td style={{ padding: '15px 12px' }}>{item.name}</td>
              <td>
                <span style={{ backgroundColor: '#EDE9FE', color: '#6F2CF3', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                  {item.quantity}
                </span>
              </td>
              <td>{item.category}</td>
              <td style={{ textAlign: 'right' }}>
                <button 
                style={{ marginRight: '10px', background: 'none', border: 'none', color: '#6F2CF3', cursor: 'pointer' }}>
                  Edit
                </button>
                <button 
                onClick={() => handleDelete(item.firestoreId)} 
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(84, 79, 79, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginBottom: '20px', color: '#1A1A1A' }}>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#1A1A1A' }}>Product Name</label>
                <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#1A1A1A' }}>Category</label>
                <input required type="text" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#1A1A1A' }}>Quantity</label>
                <input required type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#f28fed', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
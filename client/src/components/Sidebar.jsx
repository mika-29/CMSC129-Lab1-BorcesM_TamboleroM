// src/components/Sidebar.jsx
import React from 'react';
import { db } from '../firebase'; 

const Sidebar = ({ setActiveTab }) => {
  const menuItems = ['Products', 'Categories'];

  return (
    <div style={{
      width: '240px',
      backgroundColor: '#e28cc3', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      height: '100vh',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ marginBottom: '40px', fontSize: '24px' }}>Inventory</h2>
      
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <div key={item} style={{
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: item === 'Products' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            fontWeight: item === 'Products' ? '600' : '400'
          }}>
            {item}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        <div style={{ padding: '12px 16px', cursor: 'pointer', color: '#E0E0E0' }}>Log out</div>
      </div>
    </div>
  );
};

export default Sidebar;
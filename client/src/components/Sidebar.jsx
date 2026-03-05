import React from 'react';

const Sidebar = ({ setActiveTab }) => {
  const menuItems = ['Products'];

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
      <h2 style={{ marginBottom: '40px', fontSize: '36px' }}>Inventory</h2>
      
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
    </div>
  );
};

export default Sidebar;
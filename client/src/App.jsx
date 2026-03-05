import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';

function App() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: 'Inter, sans-serif' }}>
      {/* Fixed Sidebar */}
      <Sidebar /> 

      {/* Main Content Area - Added flex: 1 and minWidth: 0 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#F9FAFB',
        minWidth: 0 // Prevents the content from pushing past the screen edge
      }}>
        <main style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'products' ? <ProductList /> : <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default App;
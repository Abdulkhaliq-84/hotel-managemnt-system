import React from 'react';

const ReportsPageSimple: React.FC = () => {
  console.log('ReportsPageSimple rendering...');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Reports Page Test</h1>
      <p>If you can see this, the basic component is working.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h2>Debug Info:</h2>
        <ul>
          <li>Component mounted: ✓</li>
          <li>Basic rendering: ✓</li>
          <li>Time: {new Date().toLocaleTimeString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsPageSimple;

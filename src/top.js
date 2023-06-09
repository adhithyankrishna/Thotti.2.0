import React from 'react';
import topimg from './topimg.png';

const Top = () => {
  return (
    <div className="top" style={{ minHeight: '10px' }}>
      <img src={topimg} alt="logo" style={{ width: '100%', maxHeight: '1%', display: 'block' }} />
    </div>
  );
};

export default Top;

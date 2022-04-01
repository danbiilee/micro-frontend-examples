import React from 'react';

const Button = ({ onClick, children }: { onClick: any; children: any }) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: 'darkblue', color: 'white' }}
    >
      {children}
    </button>
  );
};

export default Button;

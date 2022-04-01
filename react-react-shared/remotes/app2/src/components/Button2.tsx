import React, { useState } from 'react';

const Button = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      app2 button {count}
    </button>
  );
};

export default Button;

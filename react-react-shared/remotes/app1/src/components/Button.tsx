import React, { useState } from 'react';
import SharedButton from '@managent/shared/src/components/Button';

const Button = () => {
  const [count, setCount] = useState(0);

  return (
    <SharedButton onClick={() => setCount(prev => prev + 1)}>
      app1 button {count}
    </SharedButton>
  );
};

export default Button;

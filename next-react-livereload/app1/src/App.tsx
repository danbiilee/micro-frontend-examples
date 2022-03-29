import React, { useState } from 'react';
import LocalButton from './components/Button';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Remote App1</h1>
      <button
        onClick={() => {
          setCount(prev => prev + 1);
        }}
      >
        count button
      </button>
      {count}
      <LocalButton />
    </div>
  );
};

export default App;

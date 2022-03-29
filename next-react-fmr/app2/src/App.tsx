import React, { useState } from 'react';
import LocalButton from './components/Button2';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Remote App2</h1>
      <button onClick={() => setCount(prev => prev + 1)}>count button</button>
      {count}!
      <LocalButton />
    </div>
  );
};

export default App;

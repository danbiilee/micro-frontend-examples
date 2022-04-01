import React from 'react';

const RemoteButton1 = React.lazy(() => import('app1/Button'));
const RemoteButton2 = React.lazy(() => import('app2/Button'));

const App = () => {
  return (
    <div>
      <h1>Host</h1>
      <React.Suspense fallback="Loading Button">
        <RemoteButton1 />
      </React.Suspense>
      <React.Suspense fallback="Loading Button">
        <RemoteButton2 />
      </React.Suspense>
    </div>
  );
};

export default App;

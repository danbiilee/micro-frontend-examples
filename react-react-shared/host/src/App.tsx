import React from 'react';

const RemoteButton1 = React.lazy(
  () => import(`${process.env.MANAGENT_MF_NAME_APP1}/Button`),
);
const RemoteButton2 = React.lazy(
  () => import(`${process.env.MANAGENT_MF_NAME_APP2}/Button`),
);

const App = () => {
  return (
    <div>
      <h1>Host with shared libraries</h1>
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

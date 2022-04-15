import React from 'react';
import FederatedComponent from './components/FederatedComponent';

const RemoteButton1 = (
  <FederatedComponent
    module="./Button"
    scope={process.env.MANAGENT_MF_NAME_APP1}
    url="http://localhost:3001/app1RemoteEntry.js"
  />
);
const RemoteButton2 = React.lazy(
  () => import(`${process.env.MANAGENT_MF_NAME_APP2}/Button`),
);

const App = () => {
  return (
    <div>
      <h1>Host with shared libraries</h1>
      {RemoteButton1}
      <React.Suspense fallback="Loading Button">
        <RemoteButton2 />
      </React.Suspense>
    </div>
  );
};

export default App;

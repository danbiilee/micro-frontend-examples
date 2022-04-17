import React from 'react';
import FederatedComponent from '../FederatedComponent';

const RemoteApp2 = ({ module }: { module: string }) => {
  return (
    <FederatedComponent
      module={module}
      scope={process.env.MANAGENT_MF_NAME_APP2}
      url={`${process.env.MANAGENT_MF_URL_APP2}/${process.env.MANAGENT_MF_NAME_APP2}RemoteEntry.js`}
    />
  );
};

export default RemoteApp2;

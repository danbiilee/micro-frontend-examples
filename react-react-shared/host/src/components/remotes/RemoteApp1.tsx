import React from 'react';
import FederatedComponent from '../FederatedComponent';

const RemoteApp1 = ({ module }: { module: string }) => {
  return (
    <FederatedComponent
      module={module}
      scope={process.env.MANAGENT_MF_NAME_APP1}
      url={`${process.env.MANAGENT_MF_URL_APP1}/${process.env.MANAGENT_MF_NAME_APP1}RemoteEntry.js`}
    />
  );
};

export default RemoteApp1;

import React from 'react';
import useFederatedComponent, { Error } from '@managent/shared';

// TODO props를 정의할 수 없는 문제 개선 필요
const FederatedComponent = ({
  module,
  scope,
  url,
  errorPage,
  onClick,
  ...rest
}: {
  module: string;
  scope: string;
  url: string;
  errorPage?: any;
  onClick?: any;
}) => {
  const {
    Component: RemoteApp,
    errorLoading,
  }: { Component: any; errorLoading: boolean } = useFederatedComponent(
    url,
    scope,
    module,
  );

  const renderErrorPage = () => {
    if (errorPage) {
      return errorPage;
    }
    return <Error />;
  };

  return (
    <>
      {errorLoading
        ? renderErrorPage()
        : RemoteApp && (
            <React.Suspense fallback="Loading Remote App...">
              <RemoteApp onClick={onClick} {...rest} />
            </React.Suspense>
          )}
    </>
  );
};

export default FederatedComponent;

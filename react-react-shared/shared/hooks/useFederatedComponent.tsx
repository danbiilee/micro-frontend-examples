import React, { useState, useEffect } from 'react';

const loadComponent = (scope: any, module: string) => {
  return async () => {
    // @ts-ignore
    await __webpack_init_sharing__('default');
    const container = window[scope];
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    let Module;
    try {
      // @ts-ignore
      const factory = await window[scope].get(module);
      Module = factory();
    } catch (e) {
      console.error('loadComponent Error >>>>> ', e);
      Module = import('../components/Error');
    }
    return Module;
  };
};

const urlCache = new Set();
const useDynamicScript = (
  url: string,
): { errorLoading: boolean; ready: boolean } => {
  const [ready, setReady] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setErrorLoading(false);
      return;
    }

    setReady(false);
    setErrorLoading(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setErrorLoading(true);
    };

    document.head.appendChild(element);

    return () => {
      urlCache.delete(url);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    errorLoading,
    ready,
  };
};

const componentCache = new Map();

const useFederatedComponent = (
  remoteUrl: string,
  scope: string,
  module: string,
): { Component: any; errorLoading: boolean } => {
  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = useState(null);

  const { ready, errorLoading } = useDynamicScript(remoteUrl);
  useEffect(() => {
    if (Component) setComponent(null);
  }, [key]);

  useEffect(() => {
    if (ready && !Component) {
      const Comp: any = React.lazy(loadComponent(scope, module));
      componentCache.set(key, Comp);
      setComponent(Comp);
    }
  }, [Component, ready, key]);

  return { Component, errorLoading };
};

export default useFederatedComponent;

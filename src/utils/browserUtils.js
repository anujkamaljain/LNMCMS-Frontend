export const isSafari = () => {
  const userAgent = navigator.userAgent;
  return /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isMacOS = () => {
  return /Mac OS X/.test(navigator.userAgent);
};

export const requiresTokenFallback = () => {
  return isSafari() || isIOS();
};

export const getFirebaseAuthErrorMessage = (error, t) => {
  if (!error) return t('auth.errorGoogle', 'Authentication failed. Please try again.');

  const code = error.code;
  const errorMap = {
    'auth/popup-blocked': 'auth.errorGooglePopupBlocked',
    'auth/cancelled-popup-request': 'auth.errorGoogleCancelled',
    'auth/popup-closed-by-user': 'auth.errorGoogleCancelled',
    'auth/unauthorized-domain': 'auth.errorUnauthorizedDomain',
    'auth/network-request-failed': 'auth.errorNetwork',
    'auth/user-disabled': 'auth.errorUserDisabled',
    'auth/account-exists-with-different-credential': 'auth.errorAccountExists',
    'auth/email-already-in-use': 'auth.errorAccountExists',
    'auth/invalid-verification-code': 'auth.errorInvalidCode',
    'auth/code-expired': 'auth.errorCodeExpired',
    'auth/invalid-email': 'auth.errorInvalidEmail',
    'auth/weak-password': 'auth.errorWeakPassword',
  };

  if (code && errorMap[code]) {
    return t(errorMap[code]);
  }

  return error.message || t('auth.errorGoogle', 'Authentication failed. Please try again.');
};

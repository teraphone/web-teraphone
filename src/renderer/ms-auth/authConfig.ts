export const BASE_URI = location.origin;
export const REDIRECT_URI = BASE_URI + '/home';
export const LOGOUT_REDIRECT_URI = BASE_URI;

export const msalConfig = {
  auth: {
    clientId: '9ef60b2f-3246-4390-8e17-a57478e7ec45',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: LOGOUT_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
};

export const teraphoneAppScopes = [
  'api://9ef60b2f-3246-4390-8e17-a57478e7ec45/User.Read',
  'User.Read',
  'User.ReadBasic.All',
  'Team.ReadBasic.All',
  'openid',
  'profile',
  'email',
  'offline_access',
];

export const loginRequest = {
  scopes: ['api://9ef60b2f-3246-4390-8e17-a57478e7ec45/User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};

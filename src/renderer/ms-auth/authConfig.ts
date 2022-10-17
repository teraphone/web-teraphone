export const BASE_URI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://web.teraphone.app';
export const REDIRECT_URI = BASE_URI + '/login'; // change redirect uri in azure app registration
export const LOGOUT_REDIRECT_URI = BASE_URI;

export const msalConfig = {
  auth: {
    clientId: '9ef60b2f-3246-4390-8e17-a57478e7ec45',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: LOGOUT_REDIRECT_URI,
  },
};

// export const teraphoneAppScopes = [
//   'api://9ef60b2f-3246-4390-8e17-a57478e7ec45/User.Read',
//   'User.Read',
//   'User.ReadBasic.All',
//   'Team.ReadBasic.All',
//   'openid',
//   'profile',
//   'email',
//   'offline_access',
// ];

export const teraphoneAppScopes = [
  'api://9ef60b2f-3246-4390-8e17-a57478e7ec45/User.Read',
];

export const loginRequest = {
  scopes: ['api://9ef60b2f-3246-4390-8e17-a57478e7ec45/User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};

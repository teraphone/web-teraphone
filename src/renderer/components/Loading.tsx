/* eslint-disable no-console */
import * as React from 'react';
import { ArrowBackIos } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectMSAuthResult,
  setAccessToken,
  setAccessTokenExpiration,
  setMSAuthResult,
  setRefreshToken,
  setRefreshTokenExpiration,
} from '../redux/AuthSlice';
import { signIn } from '../redux/Firebase';
import { setTenantUser, setSubscription } from '../redux/AppUserSlice';
import { TenantUser, Subscription } from '../models/models';
import LoginFooter from './LoginFooter';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { teraphoneAppScopes } from '../ms-auth/authConfig';
import { useNavigate, useParams } from 'react-router-dom';

type LoginResponse = {
  success: boolean;
  accessToken: string;
  accessTokenExpiration: number;
  refreshToken: string;
  refreshTokenExpiration: number;
  firebaseAuthToken: string;
  user: TenantUser;
  subscription: Subscription;
};

const Loading = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { inProgress, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [loginError, setLoginError] = React.useState('');
  const queryParams = useParams();
  const { accessToken: msAccessToken } = useAppSelector(selectMSAuthResult);

  const handleLogin = React.useCallback(
    async (token: string) => {
      let success = false;
      const params: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msAccessToken: token }),
      };
      try {
        console.log('login with params', params);
        const response = await window.fetch(
          'https://api.teraphone.app/v1/public/login',
          params
        );
        if (response.ok) {
          const data: LoginResponse = await response.json();
          dispatch(setAccessToken(data.accessToken));
          dispatch(setAccessTokenExpiration(data.accessTokenExpiration));
          dispatch(setRefreshToken(data.refreshToken));
          dispatch(setRefreshTokenExpiration(data.refreshTokenExpiration));
          await signIn(data.firebaseAuthToken);
          dispatch(setTenantUser(data.user));
          dispatch(setSubscription(data.subscription));
          success = true;
          console.log('login successful');
        } else {
          setLoginError('Login Failed: could not find your Teams account.');
        }
      } catch (error) {
        console.log(error);
      }

      return success;
    },
    [dispatch]
  );

  const LoginError = () => {
    if (loginError) {
      return (
        <Box component={Alert} severity="error" sx={{ width: '100%' }}>
          {loginError}
        </Box>
      );
    }
    return null;
  };

  React.useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      if (!isAuthenticated) {
        const urlObj = {
          pathname: '/',
          query: { ...queryParams },
        };
        console.log('not authenticated, redirecting to:', urlObj);
        // navigate(urlObj);
      } else {
        console.log('is authenticated');
        instance
          .acquireTokenSilent({ scopes: teraphoneAppScopes })
          .then((authResult) => dispatch(setMSAuthResult(authResult)))
          .catch(console.error);
      }
    }
  }, [
    dispatch,
    handleLogin,
    inProgress,
    instance,
    isAuthenticated,
    navigate,
    queryParams,
  ]);

  React.useEffect(() => {
    if (msAccessToken) {
      handleLogin(msAccessToken)
        .then((success) => {
          if (success) {
            navigate('/license-check');
          }
          return true;
        })
        .catch(console.error);
    }
  }, [handleLogin, msAccessToken, navigate]);

  return (
    <Container
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        {loginError ? (
          <>
            <LoginError />
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ m: 4 }}
            >
              <ArrowBackIos />
              Back
            </Button>
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
      <LoginFooter />
    </Container>
  );
};

export default Loading;

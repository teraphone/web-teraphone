import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest, BASE_URI } from '../ms-auth/authConfig';
import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import MSSignInLoadingButton from './MSSignInLoadingButton';
import LoginFooter from './LoginFooter';
import teraphoneLogo from '../../images/teraphone-logo-and-name-vertical.svg';

const MSLogin = () => {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { destination, ...query } = useParams();
  const targetPage = destination ? (destination as string) : '/loading';
  const params = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const targetUrl = BASE_URI + targetPage + '?' + params;

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      if (!isAuthenticated) {
        instance.acquireTokenSilent(loginRequest).catch(console.error);
      } else {
        const urlObj = { pathname: targetPage, query };
        console.log('redirecting to:', urlObj);
        navigate(urlObj);
      }
    }
  }, [
    inProgress,
    instance,
    isAuthenticated,
    navigate,
    query,
    targetPage,
    targetUrl,
  ]);

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      if (isAuthenticated) {
        const urlObj = { pathname: targetPage, query };
        console.log('redirecting to:', urlObj);
        navigate(urlObj);
      }
    }
  }, [inProgress, isAuthenticated, navigate, query, targetPage]);

  const handleAuthClick = useCallback(async () => {
    if (inProgress === InteractionStatus.None) {
      if (!isAuthenticated) {
        instance
          .loginRedirect({
            ...loginRequest,
            redirectStartPage: targetUrl,
          })
          .catch(console.error);
      } else {
        const urlObj = { pathname: targetPage, query };
        console.log('redirecting to:', urlObj);
        navigate(urlObj);
      }
    }
  }, [
    inProgress,
    instance,
    isAuthenticated,
    navigate,
    query,
    targetPage,
    targetUrl,
  ]);

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
          flexGrow: 1,
          gap: 6,
          justifyContent: 'center',
        }}
      >
        <Box
          alt="Teraphone logo"
          component="img"
          src={teraphoneLogo}
          sx={{ height: 112, width: 'auto' }}
        />
        <MSSignInLoadingButton loading={false} onClick={handleAuthClick} />
      </Box>
      <LoginFooter />
    </Container>
  );
};

export default MSLogin;

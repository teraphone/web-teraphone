import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest, BASE_URI } from '../ms-auth/authConfig';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  return null;
};

export default MSLogin;

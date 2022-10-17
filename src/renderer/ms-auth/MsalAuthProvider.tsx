import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { useNavigate } from 'react-router-dom';
import { CustomNavigationClient } from './NavigationClient';

const MsalAuthProvider = (props: {
  children: React.ReactNode;
  psa: PublicClientApplication;
}) => {
  const { children, psa } = props;
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  psa.setNavigationClient(navigationClient);

  return <MsalProvider instance={psa}>{children}</MsalProvider>;
};

export default MsalAuthProvider;

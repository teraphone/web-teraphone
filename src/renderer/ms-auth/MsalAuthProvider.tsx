import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { useNavigate } from 'react-router-dom';
import { CustomNavigationClient } from './NavigationClient';

const MsalAuthProvider = (props: {
  children: React.ReactNode;
  pca: PublicClientApplication;
}) => {
  const { children, pca } = props;
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);

  return <MsalProvider instance={pca}>{children}</MsalProvider>;
};

export default MsalAuthProvider;

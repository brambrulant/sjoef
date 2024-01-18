import React from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const LogoutPage = () => {
  const { logout } = useKindeAuth();

  React.useEffect(() => {
    logout();
  });

  return null;
};
export default LogoutPage;

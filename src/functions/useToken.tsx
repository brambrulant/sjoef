import React, { useState, useEffect } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export default function useToken() {
  const { getToken, isLoading: isAuthLoading, user } = useKindeAuth();
  const [token, setToken] = useState<string | undefined | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      setToken(fetchedToken);
    };

    if (!isAuthLoading) {
      fetchToken();
    }
  }, [isAuthLoading, getToken]);

  return { token, isLoading: isAuthLoading, user };
}

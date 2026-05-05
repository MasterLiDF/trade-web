'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UserInfo {
  id: string;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userInfo: UserInfo | null;
  logout: () => void;
}

export function useAuth(requireAuth: boolean = true): AuthState {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userInfoStr = localStorage.getItem('userInfo');

        if (token && userInfoStr) {
          setIsAuthenticated(true);
          setUserInfo(JSON.parse(userInfoStr));
        } else {
          setIsAuthenticated(false);
          setUserInfo(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, requireAuth, router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUserInfo(null);
    router.push('/admin/login');
  };

  return {
    isAuthenticated,
    isLoading,
    userInfo,
    logout,
  };
}

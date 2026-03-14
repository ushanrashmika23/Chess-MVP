'use client';

import { useEffect, useState } from 'react';

type CurrentUser = {
  id: string;
  name: string;
  role: 'admin' | 'student';
};

export const useAuth = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return { user };
};

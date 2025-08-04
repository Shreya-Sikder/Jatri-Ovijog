import React from 'react';
import { getCurrentUser } from './auth';

export async function getDashboardRoute() {
  const user = await getCurrentUser();
  if (!user) return '/';
  
  const isPolice = user.email?.endsWith('@police.gov');
  return isPolice ? '/police-dashboard' : '/dashboard';
}
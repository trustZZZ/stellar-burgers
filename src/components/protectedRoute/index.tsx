import { Outlet } from 'react-router-dom';
import React from 'react';
export const ProtectedRoute = ({ children }: React.PropsWithChildren) => (
  <Outlet />
);

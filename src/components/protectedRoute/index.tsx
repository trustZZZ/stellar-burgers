import { Outlet, Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '@ui';
import { selectUserState } from '@slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isLoading, isInit, user } = useSelector(selectUserState);
  // 1. Если грузится или не инициализировано
  if (isLoading || !isInit) {
    return <Preloader />;
  }

  // 2. если маршрут для авторизованного пользователя, но пользователь не авторизован, то делаем редирект
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  // 3. Если маршрут для неавторизованного пользователя, но пользователь авторизован
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // 4. Если всё ок -> показываем вложенные роуты
  return <Outlet />;
};

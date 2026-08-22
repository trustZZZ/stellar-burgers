import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '@ui';
import { selectUserState } from '@slices/userSlice';
export const ProtectedRoute = () => {
  const { isLoading, isInit, user } = useSelector(selectUserState);

  // 1. Если грузится или не инициализировано
  if (isLoading || !isInit) {
    return <Preloader />;
  }

  // 2. Если нет пользователя -> редирект на логин
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // 3. Если всё ок -> показываем вложенные роуты
  return <Outlet />;
};

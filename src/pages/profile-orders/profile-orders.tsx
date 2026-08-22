// src/pages/profile-orders.tsx
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProfileOrdersUI } from '@ui-pages';
import { selectOrders, getOrders, selectLoading } from '@slices/burgerSlice';
import { AppDispatch } from 'src/services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectLoading); // Используем ОБЩИЙ флаг loading из слайса
  // Флаг, чтобы запустить загрузку только один раз
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // ✅ ГЛАВНОЕ ПРАВИЛО: Запускаем только если еще не запускали
    if (!hasFetched) {
      dispatch(getOrders());
      setHasFetched(true);
    }
  }, [dispatch, hasFetched]);

  // 1. Если грузится - крутим прелоадер
  if (isLoading) {
    return <Preloader />;
  }
  // 3. Иначе рендерим список
  return <ProfileOrdersUI orders={orders} />;
};

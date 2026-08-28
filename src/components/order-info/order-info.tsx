import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrderByNumber,
  selectFeeds,
  selectIngredients,
  selectOrders
} from '@slices/burgerSlice';
import { useParams } from 'react-router-dom';
import { AppDispatch } from 'src/services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const feeds = useSelector(selectFeeds);
  const userOrders = useSelector(selectOrders);
  const feedOrders = feeds?.orders || [];
  const allOrders = [...userOrders, ...feedOrders];
  const dispatch: AppDispatch = useDispatch();
  const uniqueOrders = allOrders.filter(
    (order, index, self) =>
      index === self.findIndex((t) => t.number === order.number)
  );

  const orderData = useMemo(
    () =>
      /** TODO: взять переменные orderData и ingredients из стора */
      uniqueOrders.find((order) => order.number == Number(number)),
    [uniqueOrders, number]
  );

  useEffect(() => {
    if (!orderData) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, orderData, number]);

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

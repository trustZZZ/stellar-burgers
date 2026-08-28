import {
  fetchFeed,
  getOrders,
  selectFeedIsLoading,
  selectFeeds
} from '@slices/burgerSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const feeds = useSelector(selectFeeds);
  const orders = feeds?.orders || [];
  const isLoading = useSelector(selectFeedIsLoading);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch, orders.length]);

  if (!orders.length) {
    return <Preloader />;
  }
  if (isLoading) {
    return <Preloader />;
  } else {
    return (
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(fetchFeed());
        }}
      />
    );
  }
};

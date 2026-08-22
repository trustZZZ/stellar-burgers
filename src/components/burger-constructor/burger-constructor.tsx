import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  fetchOrder,
  clearConstructor,
  clearOrderModalData
} from '@slices/burgerSlice';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { selectUser } from '@slices/userSlice';
export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const onOrderClick = () => {
    if (!constructorItems?.bun || orderRequest || !user) return;
    else {
      dispatch(
        fetchOrder({
          bun: constructorItems.bun,
          ingredients: constructorItems.ingredients
        })
      );
    }
  };
  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearOrderModalData());
  };

  const price = useMemo(() => {
    if (!constructorItems) return 0;

    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

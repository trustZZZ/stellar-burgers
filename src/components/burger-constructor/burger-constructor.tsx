import { FC, useMemo, useRef } from 'react';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  fetchOrder,
  clearConstructor,
  clearOrderModalData,
  selectSuccess
} from '@slices/burgerSlice';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { selectUser } from '@slices/userSlice';
import { useNavigate } from 'react-router-dom';
export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const orderSuccess = useSelector(selectSuccess);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems?.bun || orderRequest) return;

    dispatch(
      fetchOrder({
        bun: constructorItems.bun,
        ingredients: constructorItems.ingredients
      })
    );
  };
  const closeOrderModal = () => {
    if (orderSuccess) {
      dispatch(clearOrderModalData());
      dispatch(clearConstructor());
    }
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

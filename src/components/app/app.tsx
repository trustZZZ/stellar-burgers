import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { ProtectedRoute } from '../protectedRoute';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeed,
  fetchIngredients,
  selectError,
  selectFeedNumber,
  selectIngredients,
  selectLoading
} from '@slices/burgerSlice';
import { AppDispatch } from 'src/services/store';
import { useEffect } from 'react';
import { getUserThunk } from '@slices/userSlice';
const App = () => {
  /** TODO: взять переменные из стора */
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUserThunk());
    dispatch(fetchFeed());
  }, [dispatch]);
  const feedNumber = useSelector(selectFeedNumber);
  const isIngredientsLoading = useSelector(selectLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectError);
  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route
            path='/'
            element={
              isIngredientsLoading ? (
                <Preloader />
              ) : error ? (
                <div
                  className={`${styles.error} text text_type_main-medium pt-4`}
                >
                  {error}
                </div>
              ) : ingredients.length > 0 ? (
                <ConstructorPage />
              ) : (
                <div
                  className={`${styles.title} text text_type_main-medium pt-4`}
                >
                  Нет игредиентов
                </div>
              )
            }
          />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title='' onClose={() => navigate('/profile/orders')}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
          <Route path='*' element={<NotFound404 />} />
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${feedNumber}`} onClose={() => navigate('/feed')}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate('/')}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;

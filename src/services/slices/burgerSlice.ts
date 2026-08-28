import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { TIngredient, TOrder } from '@utils-types';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';

export const fetchIngredients = createAsyncThunk(
  'burger/fetchIngredients',
  () => getIngredientsApi()
);

export const fetchOrder = createAsyncThunk(
  'burger/fetchOrder',
  (payload: { bun: TBun; ingredients: TIngredient[] }) => {
    const { bun, ingredients } = payload;
    // Серверу нужен массив ID ингредиентов
    const ingredientsIds = [bun._id, ...ingredients.map((i) => i._id)];
    return orderBurgerApi(ingredientsIds);
  }
);

export const getOrders = createAsyncThunk('burger/getOrder', () =>
  getOrdersApi()
);

export const fetchFeed = createAsyncThunk('burger/fetchFeed', () =>
  getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'burger/getOrderByNumber',
  (number: number) => getOrderByNumberApi(number)
);

interface IConstructorIngredient extends TIngredient {
  id: string;
}

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: IConstructorIngredient[];
};

type TFeedState = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

type TBun = {
  _id: string;
};

type TBurgerConstructor = {
  bun: TBun;
  ingredients: TIngredient[];
};

type TBurgerState = {
  loading: boolean;
  error: string | null;
  ingredients: TIngredient[];
  // Состояние конструктора (то, что собирает пользователь)
  constructorItems: TConstructorItems;
  // Флаг отправки заказа (блокирует кнопку)
  orderRequest: boolean;
  // Данные для модалки (результат заказа)
  orderModalData: TOrder | null;
  orders: TOrder[];
  feeds: TFeedState;
  burgerConstructor: TBurgerConstructor;
  feedNumber: string;
  succsess: boolean;
};
const initialState: TBurgerState = {
  loading: false,
  error: null,
  ingredients: [],
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  orders: [],
  feeds: {
    success: false,
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false
  },
  burgerConstructor: {
    bun: {
      _id: ''
    },
    ingredients: []
  },
  feedNumber: '',
  succsess: false
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    // Добавить булку в конструктор
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
      state.burgerConstructor.bun._id = action.payload._id;
    }, // Добавить ингредиент в конструктор
    addIngredient: (state, action: PayloadAction<IConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
      state.burgerConstructor.ingredients = [
        ...state.constructorItems.ingredients
      ];
    }, // Удалить ингредиент (по ID)
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (el) => el.id !== action.payload
        );
      state.burgerConstructor.ingredients = [
        ...state.constructorItems.ingredients
      ];
    }, // Очистить конструктор (после заказа)
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      const nextIndex = currentIndex + 1;

      // Меняем местами
      const temp = state.constructorItems.ingredients[currentIndex];
      state.constructorItems.ingredients[currentIndex] =
        state.constructorItems.ingredients[nextIndex];
      state.constructorItems.ingredients[nextIndex] = temp;
    },
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      const nextIndex = currentIndex - 1;

      // Меняем местами
      const temp = state.constructorItems.ingredients[currentIndex];
      state.constructorItems.ingredients[currentIndex] =
        state.constructorItems.ingredients[nextIndex];
      state.constructorItems.ingredients[nextIndex] = temp;
    },
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];

      state.burgerConstructor.bun._id = '';
      state.burgerConstructor.ingredients = [];
    }, // Очистить данные модалки (закрыть модалку)
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    setNumberFeed: (state, action) => {
      state.feedNumber = action.payload;
    }
  },
  extraReducers: (builder) => {
    // --- Логика загрузки ингредиентов ---
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ingredients = action.payload;
      })

      // --- Логика отправки заказа ---
      .addCase(fetchOrder.pending, (state) => {
        // 1. Ставим флаг загрузки заказа (блокирует кнопку)
        state.orderRequest = true;
        state.succsess = false;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        // 2. Заказ успешен: сохраняем данные для модалки
        state.orderRequest = false;
        state.succsess = true;
        state.orderModalData = Object.assign(action.payload.order);
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        // 4. Ошибка заказа
        state.orderRequest = false;
        state.succsess = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchFeed.pending, (state) => {
        state.feeds.isLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feeds = Object.assign(action.payload, { isLoading: false });
      });
  }
});

export const addIngredientToConstructor = (ingredient: TIngredient) =>
  burgerSlice.actions.addIngredient({
    ...ingredient,
    id: uuidv4()
  });

// --- 4. СЕЛЕКТОРЫ ---

export const selectIngredients = (state: RootState) => state.burger.ingredients;
export const selectLoading = (state: RootState) => state.burger.loading;
export const selectError = (state: RootState) => state.burger.error;

// Селекторы для конструктора
export const selectConstructorItems = (state: RootState) =>
  state.burger.constructorItems;

// Селекторы для ленты
export const selectFeedIsLoading = (state: RootState) =>
  state.burger.feeds.isLoading;
export const selectFeedNumber = (state: RootState) =>
  state.burger.feedNumber || '';
export const selectFeedOrders = (state: RootState) =>
  state.burger.feeds?.orders ?? new Array<TOrder>();

// Селекторы для заказа
export const selectOrderRequest = (state: RootState) =>
  state.burger.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burger.orderModalData;
export const selectBurgerConstructor = (state: RootState) =>
  state.burger.burgerConstructor;
export const selectOrders = (state: RootState) => state.burger.orders;
export const selectFeeds = (state: RootState) => state.burger.feeds;
export const selectSuccess = (state: RootState) => state.burger.succsess;
// Селекторы для фильтрации по типам
const selectIngredientsAll = (state: RootState) => state.burger.ingredients;

// 2. Теперь создаем мемоизированные селекторы
export const selectBuns = createSelector(
  [selectIngredientsAll],
  (ingredients) => ingredients.filter((el) => el.type === 'bun')
);

export const selectMains = createSelector(
  [selectIngredientsAll],
  (ingredients) => ingredients.filter((el) => el.type === 'main')
);

export const selectSauces = createSelector(
  [selectIngredientsAll],
  (ingredients) => ingredients.filter((el) => el.type === 'sauce')
);

// Экспортируем редюсер и экшены
export default burgerSlice.reducer;
export const {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  clearOrderModalData,
  setNumberFeed,
  moveDownIngredient,
  moveUpIngredient
} = burgerSlice.actions;

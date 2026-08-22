import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { TIngredient, TOrder } from '@utils-types';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk(
  'burger/fetchIngredients',
  () => getIngredientsApi()
);

export const fetchOrder = createAsyncThunk(
  'burger/fetchOrder',
  (orderData: { bun: TIngredient; ingredients: TIngredient[] }) => {
    // Серверу нужен массив ID ингредиентов
    const ingredientsIds = [
      orderData.bun._id,
      ...orderData.ingredients.map((i) => i._id)
    ];
    return orderBurgerApi(ingredientsIds);
  }
);

export const getOrders = createAsyncThunk('burger/getOrder', () =>
  getOrdersApi()
);

export const fetchFeed = createAsyncThunk('burger/fetchFeed', () =>
  getFeedsApi()
);

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
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
  feedNumber: ''
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    // Добавить булку в конструктор
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    }, // Добавить ингредиент в конструктор
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    }, // Удалить ингредиент (по ID)
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (el) => el !== state.constructorItems.ingredients[action.payload]
        );
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
        // ✅ ВАЖНО: Заменяем массив целиком, а не делаем push.
        // Иначе при повторной загрузке данные продублируются.
        state.ingredients = action.payload || [];
      })

      // --- Логика отправки заказа ---
      .addCase(fetchOrder.pending, (state) => {
        // 1. Ставим флаг загрузки заказа (блокирует кнопку)
        state.orderRequest = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        // 2. Заказ успешен: сохраняем данные для модалки
        state.orderRequest = false;
        state.orderModalData = Object.assign(action.payload.order);
        state.burgerConstructor = {
          bun: { _id: action.meta.arg.bun._id },
          ingredients: action.meta.arg.ingredients
        };
        // 3. Очищаем конструктор после успешного заказа (опционально, по ТЗ)
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        // 4. Ошибка заказа
        state.orderRequest = false;
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

// Селекторы для фильтрации по типам
export const selectBuns = (state: RootState) =>
  state.burger.ingredients.filter((el) => el.type === 'bun');

export const selectMains = (state: RootState) =>
  state.burger.ingredients.filter((el) => el.type === 'main');

export const selectSauces = (state: RootState) =>
  state.burger.ingredients.filter((el) => el.type === 'sauce');

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

import {
  addIngredient,
  burgerSlice,
  clearConstructor,
  fetchIngredients,
  removeIngredient,
  setBun
} from '@slices/burgerSlice';
import { RootState } from 'src/services/store';
import { v4 as uuidv4 } from 'uuid';
const { reducer } = burgerSlice;

const initialState = {
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
  burgerConstructor: { bun: { _id: '' }, ingredients: [] },
  feedNumber: '',
  succsess: false
} as RootState['burger'];

const mockBun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  }
];

// Элемент конструктора
const constructorItem = {
  ...mockIngredients[0],
  id: uuidv4()
};

const constructorIngredients = [
  {
    ...mockIngredients[0],
    id: '0'
  },
  { ...mockIngredients[1], id: '1' },
  { ...mockIngredients[2], id: '2' }
];

// Перемещение 2 элемента вверх
const moveUpIngredients = [
  {
    ...mockIngredients[1],
    id: '1'
  },
  { ...mockIngredients[0], id: '0' },
  { ...mockIngredients[2], id: '2' }
];

// Перемещение 2 элемента вниз
const moveDownIngredients = [
  {
    ...mockIngredients[0],
    id: '0'
  },
  { ...mockIngredients[2], id: '2' },
  { ...mockIngredients[1], id: '1' }
];

// Начальные данные с ингредиентами
const burgerState = {
  ...initialState,
  constructorItem: {
    bun: mockBun,
    ingredients: [constructorItem]
  },
  burgerConstructor: {
    bun: {
      _id: mockBun._id
    },
    ingredients: [constructorItem]
  }
};

describe('Проверка тестов с массивом ингредиентов для слайса burgerSlice', () => {
  test('должен обработать pending (загрузка началась)', () => {
    // Мы НЕ вызываем fetchIngredients(). Мы берем готовый экшен.
    const action = fetchIngredients.pending('');
    const newState = reducer(initialState, action);

    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('должен обработать fulfilled (данные загружены)', () => {
    const action = fetchIngredients.fulfilled(mockIngredients, '');
    const newState = reducer(initialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients);
  });

  test('должен обработать rejected (ошибка сети)', () => {
    const action = fetchIngredients.rejected(new Error('Network Error'), '');
    const newState = reducer(initialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Network Error');
  });

  test('должен игнорировать неизвестный экшен', () => {
    const action = { type: 'UNKNOWN_ACTION_TYPE' };
    const newState = reducer(initialState, action);

    // Редьюсер должен вернуть состояние без изменений
    expect(newState).toEqual(initialState);
  });

  test('должен проверить добавление булки', () => {
    const bunItem = mockBun;
    const newState = reducer(initialState, setBun(bunItem));
    expect(newState.burgerConstructor).toEqual({
      bun: {
        _id: mockBun._id
      },
      ingredients: []
    });
  });

  test('должен проверить добавление ингредиентов', () => {
    const newState = reducer(initialState, addIngredient(constructorItem));
    expect(newState.burgerConstructor).toEqual({
      bun: {
        _id: ''
      },
      ingredients: [constructorItem]
    });
  });

  test('должен проверить удаление ингредиентов', () => {
    // Добавляем ингредиент к существующему
    const newIngredient = { ...mockIngredients[1], id: uuidv4() };
    const addState = reducer(burgerState, addIngredient(newIngredient));

    // Удаляем ингредиент по id
    const newState = reducer(addState, removeIngredient(constructorItem.id));

    expect(newState.burgerConstructor.ingredients).toEqual([newIngredient]);
  });

  test('должен проверить очистку конструктора', () => {
    const newState = reducer(burgerState, clearConstructor());
    expect(newState.burgerConstructor).toEqual({
      bun: {
        _id: ''
      },
      ingredients: []
    });
  });
});

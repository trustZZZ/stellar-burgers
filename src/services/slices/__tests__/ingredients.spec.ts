import {
  addIngredient,
  burgerSlice,
  clearConstructor,
  fetchIngredients,
  removeIngredient,
  setBun
} from '@slices/burgerSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  mockIngredients,
  mockBun,
  initialState
} from '../../../../tests/fixtures.ts.js';

const { reducer } = burgerSlice;

// Элемент конструктора
const constructorItem = {
  ...mockIngredients[0],
  id: uuidv4()
};

// Начальные данные с ингредиентами
const burgerState = {
  ...initialState,
  constructorItems: {
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

describe('Проверка запросов на сервер для слайса burgerSlice', () => {
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
});

describe('Проверка тестов с массивом ингредиентов для слайса burgerSlice', () => {
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

import {
  addIngredient,
  burgerSlice,
  clearConstructor,
  fetchOrder,
  moveDownIngredient,
  moveUpIngredient,
  removeIngredient,
  setBun
} from '@slices/burgerSlice'; // <-- ИМПОРТ ОТДЕЛЬНО
import { v4 as uuidv4 } from 'uuid';
import { mockIngredients, mockBun, initialState } from '../helper';
const { reducer } = burgerSlice;

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

const owner = {
  name: 'Alex',
  email: 'test@y.ru',
  createdAt: '18:56 31-08-26',
  updatedAt: '18:57 31-08-26'
};

const orderState = {
  _id: '1',
  status: 'successful',
  name: 'test',
  owner: owner,
  createdAt: '18:56 31-08-2026',
  updatedAt: '19:12 31-08-2026',
  number: 1,
  price: 1
};

const response = {
  success: true,
  order: orderState,
  name: 'test'
};

const orderModalData = { bun: mockBun, ingredients: mockIngredients };

describe('Проверка запросов на сервер для слайса burgerSlice', () => {
  test('должен обработать pending (загрузка началась)', () => {
    const action = fetchOrder.pending('', orderModalData);
    const newState = reducer(initialState, action);

    expect(newState.orderRequest).toBe(true);
    expect(newState.succsess).toBe(false);
  });

  test('должен обработать fulfilled (данные загружены)', () => {
    const action = fetchOrder.fulfilled(response, '', orderModalData);
    const newState = reducer(initialState, action);

    expect(newState.orderRequest).toBe(false);
    expect(newState.succsess).toBe(true);
    expect(newState.orderModalData).toEqual(orderState);
  });

  test('должен обработать rejected (ошибка сети)', () => {
    const action = fetchOrder.rejected(
      new Error('Network Error'),
      '',
      orderModalData
    );
    const newState = reducer(initialState, action);

    expect(newState.orderRequest).toBe(false);
    expect(newState.succsess).toBe(false);
  });
});

describe('Проверка тестов контсруктора бургеров для слайса burgerSlice', () => {
  test('должен игнорировать неизвестный экшен', () => {
    const action = { type: 'UNKNOWN_ACTION_TYPE' };
    const newState = reducer(initialState, action);

    // Редьюсер должен вернуть состояние без изменений
    expect(newState).toEqual(initialState);
  });

  test('должен проверить добавление булки', () => {
    const bunItem = mockBun;
    const newState = reducer(initialState, setBun(bunItem));
    expect(newState.constructorItems).toEqual({
      bun: bunItem,
      ingredients: []
    });
  });

  test('должен проверить добавление ингредиентов', () => {
    const newState = reducer(initialState, addIngredient(constructorItem));
    expect(newState.constructorItems).toEqual({
      bun: null,
      ingredients: [constructorItem]
    });
  });

  test('должен проверить удаление ингредиентов', () => {
    // Добавляем ингредиент к существующему
    const newIngredient = { ...mockIngredients[1], id: uuidv4() };
    const addState = reducer(burgerState, addIngredient(newIngredient));

    // Удаляем ингредиент по id
    const newState = reducer(addState, removeIngredient(constructorItem.id));

    expect(newState.constructorItems.ingredients).toEqual([newIngredient]);
  });

  test('должен проверить перемещение ингредиента вверх', () => {
    // Добавляем ингредиент к существующему
    const ingredientsState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: constructorIngredients
      }
    };

    const newState = reducer(ingredientsState, moveUpIngredient(1));

    expect(newState.constructorItems.ingredients).toEqual(moveUpIngredients);
  });

  test('должен проверить перемещение ингредиента вниз', () => {
    // Добавляем ингредиент к существующему
    const ingredietnsState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: constructorIngredients
      }
    };

    const newState = reducer(ingredietnsState, moveDownIngredient(1));

    expect(newState.constructorItems.ingredients).toEqual(moveDownIngredients);
  });

  test('должен проверить очистку конструктора', () => {
    const newState = reducer(burgerState, clearConstructor());
    expect(newState.constructorItems).toEqual({
      bun: null,
      ingredients: []
    });
  });
});

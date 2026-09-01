import { test, expect, Locator } from '@playwright/test';

test.describe('Конструктор бургера: добавление ингредиента', () => {
  // Константы для удобства. Если название ингредиента изменится в API, меняй только здесь.
  const BUN_NAME = 'Краторная булка N-200i';
  const BUN_PRICE = 1255;
  const BUN_COUNT = 2;
  const INGREDIENT_NAME = 'Говяжий метеорит (отбивная)';
  const INGREDIENT_PRICE = 3000;

  test.beforeEach(async ({ page, context }) => {
    // 2. Мокирование данных
    await page.routeFromHAR('./e2e/tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    // 3. Переход на главную страницу
    await page.goto('/');

    // 4. ПРОВЕРКА отсутствия загрузки
    await expect(page.getByTestId('loader')).not.toBeVisible({
      timeout: 10000
    });
  });

  test('должен добавить булку в конструктор, обновить цену и изменить количество ингредиентов', async ({
    page
  }) => {
    // 1. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
    // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
    const ingredientCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: BUN_NAME });

    // Проверка: карточка вообще существует в списке?
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });

    // 2. ПОИСК КНОПКИ "ДОБАВИТЬ"
    // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
    const addButton = ingredientCard.getByRole('button', { name: /добавить/i });
    await expect(addButton).toBeVisible();

    // 3. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
    await addButton.click();

    // 4. ПРОВЕРКА: ИНГРЕДИЕНТ ПОЯВИЛСЯ В ЗОНЕ СБОРКИ
    await expect(page.locator(`img[alt="${BUN_NAME} (верх)"]`)).toBeVisible();

    await expect(page.locator(`img[alt="${BUN_NAME} (низ)"]`)).toBeVisible(); // Исправил на низ

    // 5. ПРОВЕРКА ИТОГОВОЙ ЦЕНЫ
    const totalPriceLocator = page.getByTestId('total-price');

    // Получаем текст цены. Удаляем все пробелы
    const priceText = await totalPriceLocator.innerText();
    const currentPrice = parseInt(priceText.replace(/\s/g, ''), 10);

    // Проверяем, что цена равна стоимости ингредиента.
    expect(currentPrice).toBe(BUN_PRICE * 2);
    // 6. ПРОВЕРКА изменения количества ингредиентов в списке
    const counterLocator = ingredientCard.getByTestId('ingredient-counter');
    const bunCounter = await getCountValue(counterLocator);
    expect(bunCounter).toBe(BUN_COUNT);
  });
  test('должен добавить ингредиент в конструктор, обновить цену и изменить количество ингредиентов', async ({
    page
  }) => {
    // 1. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
    // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
    const ingredientCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: INGREDIENT_NAME });

    // Проверка: карточка вообще существует в списке?
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });

    // 2. ПОИСК КНОПКИ "ДОБАВИТЬ"
    // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
    const addButton = ingredientCard.getByRole('button', { name: /добавить/i });
    await expect(addButton).toBeVisible();

    // 3. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
    await addButton.click();

    // 4. ПРОВЕРКА: ИНГРЕДИЕНТ ПОЯВИЛСЯ В ЗОНЕ СБОРКИ
    await expect(page.locator(`img[alt="${INGREDIENT_NAME}"]`)).toBeVisible();

    // 5. ПРОВЕРКА ИТОГОВОЙ ЦЕНЫ
    const totalPriceLocator = page.getByTestId('total-price');

    // Получаем текст цены. Удаляем все пробелы
    const priceText = await totalPriceLocator.innerText();
    const currentPrice = parseInt(priceText.replace(/\s/g, ''), 10);

    // Проверяем, что цена равна стоимости ингредиента.
    expect(currentPrice).toBe(INGREDIENT_PRICE);
    // 6. ПРОВЕРКА изменения количества ингредиентов в списке
    const counterLocator = ingredientCard.getByTestId('ingredient-counter');

    // Ждем, пока он появится (он появляется только когда count > 0)
    await expect(counterLocator).toBeVisible({ timeout: 5000 });
    let countValue = await getCountValue(counterLocator);
    expect(countValue).toBe(1);
    // Нажимаем добавить ингредиент
    await addButton.click();
    countValue = await getCountValue(counterLocator);
    expect(countValue).toBe(2);
    // 7. Проверка удаления ингредиента из конструктора
    //  1. Поиск элемента
    const ingredientInConstructorElement = page
      .locator(`.constructor-element`)
      .filter({ hasText: INGREDIENT_NAME })
      .first(); // Если их несколько, то берем первый

    // Ждем, пока ингредиент появится в сборке
    await expect(ingredientInConstructorElement).toBeVisible({
      timeout: 10000
    });

    //  2. Ищем кнопку удаления ВНУТРИ этой карточки.
    // Мы знаем, что она имеет класс .constructor-element__action
    const deleteButton = ingredientInConstructorElement.locator(
      '.constructor-element__action'
    );

    // Проверяем, что кнопка видна
    await expect(deleteButton).toBeVisible();

    //  3. КЛИК ПО КНОПКЕ
    await deleteButton.click();

    //  4. изменение количества в списке
    countValue = await getCountValue(counterLocator);
    expect(countValue).toBe(1);
    //  5. изменение количества ингредиентов в конструкторе
    const ingredientInConstructorElements = page
      .locator(`.constructor-element`)
      .filter({ hasText: INGREDIENT_NAME });
    await expect(ingredientInConstructorElements).toHaveCount(1);
  });
  test('должен осуществить проверку работы модальных окон, открыть, закрыть на крестик, закрыть по клику на оверлей', async ({
    page
  }) => {
    // 1. ПРОВЕРКА НАЛИЧИЯ ЭЛЕМЕНТА
    const ingredientCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: BUN_NAME });

    // Проверка: карточка вообще существует в списке?
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });
    // 2. ПРОВЕРКА открытия модального окна
    await ingredientCard.click();

    // Проверка: существует ли модальное окно и оверлэй
    const modal = page.getByTestId('modal');
    const modalOverlay = page.getByTestId('modal-overlay');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modalOverlay).toBeVisible({ timeout: 1000 });
    await expect(modal).toContainText(BUN_NAME);
    // 3. ПРОВЕРКА закрытия модального окна

    // Проверка: существует ли кнопка закрытия
    const closeButton = modal.getByRole('button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    // Проверка: закрыто ли модальное окно по нажатию кнопки
    await expect(modal).not.toBeVisible({ timeout: 1000 });
    await expect(modalOverlay).not.toBeVisible({ timeout: 1000 });
    // Проверка: закрыто ли модальное окно по нажатию на оверлэй
    await ingredientCard.click();
    await modalOverlay.click({ position: { x: 10, y: 10 } });
    await expect(modalOverlay).not.toBeVisible();
    await expect(modal).not.toBeVisible();
  });
  test('должен проверить работу создания заказа', async ({ context, page }) => {
    // 1. Установка токенов в localStorage и cookies
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'super-secret-auth-token',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.addInitScript(() => {
      // Этот код выполнится в браузере!
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    //   // 1. МОКИРОВАНИЕ ДАННЫХ (HAR)
    await page.routeFromHAR('./e2e/tests/hars/user.har', {
      url: '**/user',
      update: false
    });

    page.goto('/');

    // 2. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
    // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
    const card = page.getByTestId('ingredient-card');
    const burgerCard = card.filter({ hasText: BUN_NAME });

    // Проверка: карточка вообще существует в списке?
    await expect(burgerCard).toBeVisible({ timeout: 10000 });

    // 3. ПОИСК КНОПКИ "ДОБАВИТЬ"
    // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
    const addBunButton = burgerCard.getByRole('button', { name: /добавить/i });
    await expect(addBunButton).toBeVisible({ timeout: 1000 });

    // 4. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
    await addBunButton.click();

    // 5. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
    // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
    const ingredientCard = card.filter({ hasText: INGREDIENT_NAME });

    // Проверка: карточка вообще существует в списке?
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });

    // 6. ПОИСК КНОПКИ "ДОБАВИТЬ"
    // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
    const addIngredientButton = ingredientCard.getByRole('button', {
      name: /добавить/i
    });
    await expect(addIngredientButton).toBeVisible();

    // 7. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
    await addIngredientButton.click();

    const orderButton = page.getByTestId('btn-add-constructor');
    await expect(orderButton).toBeVisible({ timeout: 1000 });

    await page.routeFromHAR('./e2e/tests/hars/orders.har', {
      url: '**/orders',
      update: false
    });

    await orderButton.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('loader')).not.toBeVisible();
    await expect(page.getByTestId('successful-order-answer')).toContainText(
      'Ваш заказ начали готовить'
    ); // Проверка номера заказа
    await expect(page.getByTestId('order-number')).toContainText('1999');
    const closeModalButton = page.getByTestId('close-modal-btn');
    await expect(closeModalButton).toBeVisible({ timeout: 10000 });
    await closeModalButton.click();
    await expect(modal).not.toBeVisible({ timeout: 10000 });

    const constructorBunUp = page.getByTestId('constructor-bun-up');
    const constructorBunDown = page.getByTestId('constructor-bun-down');
    const constructorIngredient = page.getByTestId('constructor-ingredient');
    const totalPriceLocator = page.getByTestId('total-price');
    const priceText = await totalPriceLocator.innerText();
    const currentPrice = parseInt(priceText.replace(/\s/g, ''), 10);

    await expect(constructorBunUp).toContainText('Выберите булки');
    await expect(constructorBunDown).toContainText('Выберите булки');
    await expect(constructorIngredient).toContainText('Выберите начинку');
    expect(currentPrice).toBe(0);
  });
});

const getCountValue = async (counterLocator: Locator) => {
  const rawText = await counterLocator.innerText();
  // Пример вывода: "23000Говяжий метеорит (отбивная)"

  // Регулярка \d+ ищет последовательность цифр.
  // match вернет массив, например ["2"], или null, если цифр нет.
  const match = rawText.match(/^\d+/);

  if (!match) {
    throw new Error(`Не удалось найти цифру счетчика в тексте: "${rawText}"`);
  }

  const countValue = parseInt(match[0], 10);
  return countValue;
};

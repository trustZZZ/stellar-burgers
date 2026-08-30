import { test, expect, Locator } from '@playwright/test';

test.describe('Конструктор бургера: добавление ингредиента', () => {
  // Константы для удобства. Если название ингредиента изменится в API, меняй только здесь.
  const BUN_NAME = 'Краторная булка N-200i';
  const BUN_PRICE = 1255;
  const BUN_COUNT = '2';
  const INGREDIENT_NAME = 'Говяжий метеорит (отбивная)';
  const INGREDIENT_PRICE = 3000;

  // test('должен добавить булку в конструктор, обновить цену и изменить количество ингредиентов', async ({
  //   page
  // }) => {
  //   // 1. МОКИРОВАНИЕ ДАННЫХ (HAR)
  //   await page.routeFromHAR('./e2e/hars/ingredients.har', {
  //     url: '**/ingredients',
  //     update: false
  //   });

  //   // 2. ПЕРЕХОД НА СТРАНИЦУ
  //   await page.goto('/');
  //   // 3. ПРОВЕРКА ЗАГРУЗКИ ДАННЫХ
  //   await expect(page.getByTestId('loader')).not.toBeVisible();

  //   // 4. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
  //   // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
  //   const ingredientCard = page
  //     .getByTestId('ingredient-card')
  //     .filter({ hasText: BUN_NAME });

  //   // Проверка: карточка вообще существует в списке?
  //   await expect(ingredientCard).toBeVisible({ timeout: 10000 });

  //   // 5. ПОИСК КНОПКИ "ДОБАВИТЬ"
  //   // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
  //   const addButton = ingredientCard.getByRole('button', { name: /добавить/i });
  //   await expect(addButton).toBeVisible();

  //   // 6. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
  //   await addButton.click();

  //   // 7. ПРОВЕРКА: ИНГРЕДИЕНТ ПОЯВИЛСЯ В ЗОНЕ СБОРКИ
  //   await expect(page.locator(`img[alt="${BUN_NAME} (верх)"]`)).toBeVisible();

  //   await expect(page.locator(`img[alt="${BUN_NAME} (верх)"]`)).toBeVisible();

  //   // 9. ПРОВЕРКА ИТОГОВОЙ ЦЕНЫ
  //   const totalPriceLocator = page.getByTestId('total-price');

  //   // Получаем текст цены. Удаляем все пробелы
  //   const priceText = await totalPriceLocator.innerText();
  //   const currentPrice = parseInt(priceText.replace(/\s/g, ''), 10);

  //   // Проверяем, что цена равна стоимости ингредиента.
  //   expect(currentPrice).toBe(BUN_PRICE * 2);
  //   // 10. ПРОВЕРКА изменения количества ингредиентов в списке
  //   const counterLocator = ingredientCard.getByTestId('ingredient-counter');
  //   const bunCounter = await getCountValue(counterLocator);
  //   expect(bunCounter).toBe(BUN_COUNT);
  // });
  // test('должен добавить ингредиент в конструктор, обновить цену и изменить количество ингредиентов', async ({
  //   page
  // }) => {
  //   // 1. МОКИРОВАНИЕ ДАННЫХ (HAR)
  //   await page.routeFromHAR('./e2e/hars/ingredients.har', {
  //     url: '**/ingredients',
  //     update: false
  //   });

  //   // 2. ПЕРЕХОД НА СТРАНИЦУ
  //   await page.goto('/');
  //   // 3. ПРОВЕРКА ЗАГРУЗКИ ДАННЫХ
  //   await expect(page.getByTestId('loader')).not.toBeVisible();

  //   // 4. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
  //   // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
  //   const ingredientCard = page
  //     .getByTestId('ingredient-card')
  //     .filter({ hasText: INGREDIENT_NAME });

  //   // Проверка: карточка вообще существует в списке?
  //   await expect(ingredientCard).toBeVisible({ timeout: 10000 });

  //   // 5. ПОИСК КНОПКИ "ДОБАВИТЬ"
  //   // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
  //   const addButton = ingredientCard.getByRole('button', { name: /добавить/i });
  //   await expect(addButton).toBeVisible();

  //   // 6. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
  //   await addButton.click();

  //   // 7. ПРОВЕРКА: ИНГРЕДИЕНТ ПОЯВИЛСЯ В ЗОНЕ СБОРКИ
  //   await expect(page.locator(`img[alt="${INGREDIENT_NAME}"]`)).toBeVisible();

  //   // 9. ПРОВЕРКА ИТОГОВОЙ ЦЕНЫ
  //   const totalPriceLocator = page.getByTestId('total-price');

  //   // Получаем текст цены. Удаляем все пробелы
  //   const priceText = await totalPriceLocator.innerText();
  //   const currentPrice = parseInt(priceText.replace(/\s/g, ''), 10);

  //   // Проверяем, что цена равна стоимости ингредиента.
  //   expect(currentPrice).toBe(INGREDIENT_PRICE);
  //   // 10. ПРОВЕРКА изменения количества ингредиентов в списке
  //   const counterLocator = ingredientCard.getByTestId('ingredient-counter');

  //   // Ждем, пока он появится (он появляется только когда count > 0)
  //   await expect(counterLocator).toBeVisible({ timeout: 5000 });
  //   let countValue = await getCountValue(counterLocator);
  //   expect(countValue).toBe(1);
  //   // Нажимаем добавить ингредиент
  //   await addButton.click();
  //   countValue = await getCountValue(counterLocator);
  //   expect(countValue).toBe(2);
  //   // 11. Проверка удаления ингредиента из конструктора
  //   //  1. Поиск элемента
  //   const ingredientInConstructorElement = page
  //     .locator(`.constructor-element`)
  //     .filter({ hasText: INGREDIENT_NAME })
  //     .first(); // Если их несколько, то берем первый

  //   // Ждем, пока ингредиент появится в сборке
  //   await expect(ingredientInConstructorElement).toBeVisible({
  //     timeout: 10000
  //   });

  //   //  2. Ищем кнопку удаления ВНУТРИ этой карточки.
  //   // Мы знаем, что она имеет класс .constructor-element__action
  //   const deleteButton = ingredientInConstructorElement.locator(
  //     '.constructor-element__action'
  //   );

  //   // Проверяем, что кнопка видна
  //   await expect(deleteButton).toBeVisible();

  //   //  3. КЛИК ПО КНОПКЕ
  //   await deleteButton.click();

  //   //  4. изменение количества в списке
  //   countValue = await getCountValue(counterLocator);
  //   expect(countValue).toBe(1);
  //   //  5. изменение количества ингредиентов в конструкторе
  //   const ingredientInConstructorElements = page
  //     .locator(`.constructor-element`)
  //     .filter({ hasText: INGREDIENT_NAME });
  //   await expect(ingredientInConstructorElements).toHaveCount(1);
  // });
  // test('должен добавить ингредиент в конструктор, обновить цену и изменить количество ингредиентов', async ({
  //   page
  // }) => {
  //   // 1. МОКИРОВАНИЕ ДАННЫХ (HAR)
  //   await page.routeFromHAR('./e2e/hars/ingredients.har', {
  //     url: '**/ingredients',
  //     update: false
  //   });

  //   // 2. ПЕРЕХОД НА СТРАНИЦУ
  //   await page.goto('/');
  //   // 3. ПРОВЕРКА НАЛИЧИЯ ЭЛЕМЕНТА
  //   const ingredientCard = page
  //     .getByTestId('ingredient-card')
  //     .filter({ hasText: BUN_NAME });

  //   // Проверка: карточка вообще существует в списке?
  //   await expect(ingredientCard).toBeVisible({ timeout: 10000 });
  //   // 4. ПРОВЕРКА открытия модального окна
  //   await ingredientCard.click();

  //   // Проверка: существует ли модальное окно и оверлэй
  //   const modal = page.getByTestId('modal');
  //   const modalOverlay = page.getByTestId('modal-overlay');
  //   await expect(modal).toBeVisible({ timeout: 10000 });
  //   await expect(modalOverlay).toBeVisible({ timeout: 1000 });

  //   // 5. ПРОВЕРКА закрытия модального окна

  //   // Проверка: существует ли кнопка закрытия
  //   const closeButton = modal.getByRole('button');
  //   await expect(closeButton).toBeVisible();
  //   closeButton.click();
  //   // Проверка: закрыто ли модальное окно по нажатию кнопки
  //   await expect(modal).not.toBeVisible({ timeout: 1000 });
  //   await expect(modalOverlay).not.toBeVisible({ timeout: 1000 });
  //   // Проверка: закрыто ли модальное окно по нажатию на оверлэй
  //   await ingredientCard.click();
  //   await modalOverlay.click({ position: { x: 10, y: 10 } });
  //   await expect(modalOverlay).not.toBeVisible();
  // });
  test('должен добавить булку в конструктор, обновить цену и изменить количество ингредиентов', async ({
    context,
    page
  }) => {
    // await page.goto('/login');
    // await page.fill('input[name="email"]', 'akexey.113@yandex.ru');
    // await page.fill('input[name="password"]', 'zxcVbnm<123');
    // await page.click('button[type="submit"]');

    // const userName = page.getByTestId('user-name');
    // await expect(userName).toBeVisible({ timeout: 1000 });
    // await expect(userName).toContainText('Alexey');
    //   await context.addCookies([
    //     {
    //       name: 'token',
    //       value: 'super-secret-auth-token',
    //       domain: 'localhost',
    //       path: '/'
    //     }
    //   ]);
    //   await page.addInitScript(() => {
    //     // Этот код выполнится в браузере!
    //     localStorage.setItem('theme', 'dark');
    //     localStorage.setItem(
    //       'user_preferences',
    //       JSON.stringify({ notifications: false })
    //     );
    //   });
    //   // 1. МОКИРОВАНИЕ ДАННЫХ (HAR)
    await page.routeFromHAR('./e2e/hars/user.har', {
      url: '**/user',
      update: false
    });

    await page.goto('/profile');
    const profileMenu = page.getByTestId('profile-menu');
    await expect(profileMenu).toBeVisible({ timeout: 1000 });

    await page.routeFromHAR('./e2e/hars/orders.har', {
      url: '**/orders',
      update: false
    });

    await page.addInitScript(() => {
      // Вставь сюда фейковые токены.
      // Проверь в F12 -> Application -> Local Storage, какие ключи использует твой проект.
      // Обычно это 'refreshToken' и 'accessToken'
      localStorage.setItem('refreshToken', 'fake-refresh-token-123');
      localStorage.setItem('accessToken', 'fake-access-token-456');

      // Если твой код хранит данные пользователя явно:
      // localStorage.setItem('user', JSON.stringify({ name: 'Alexey' }));
    });
    await page.goto('/');
    // 3. ПРОВЕРКА ЗАГРУЗКИ ДАННЫХ
    await expect(page.getByTestId('loader')).not.toBeVisible();

    // 4. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
    // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
    const card = page.getByTestId('ingredient-card');
    const burgerCard = card.filter({ hasText: BUN_NAME });

    // Проверка: карточка вообще существует в списке?
    await expect(burgerCard).toBeVisible({ timeout: 10000 });

    // 5. ПОИСК КНОПКИ "ДОБАВИТЬ"
    // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
    const addBunButton = burgerCard.getByRole('button', { name: /добавить/i });
    await expect(addBunButton).toBeVisible({ timeout: 1000 });

    console.log(addBunButton);

    // 6. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
    await addBunButton.click();

    // 4. ПОИСК КАРТОЧКИ ИНГРЕДИЕНТА
    // Ищем элемент с data-testid="ingredient-card", внутри которого есть нужный текст.
    const ingredientCard = card.filter({ hasText: INGREDIENT_NAME });

    // Проверка: карточка вообще существует в списке?
    await expect(ingredientCard).toBeVisible({ timeout: 10000 });

    // 5. ПОИСК КНОПКИ "ДОБАВИТЬ"
    // Ищем кнопку внутри карточки по роли и тексту. /i делает поиск нечувствительным к регистру.
    const addIngredientButton = ingredientCard.getByRole('button', {
      name: /добавить/i
    });
    await expect(addIngredientButton).toBeVisible();

    // 6. ДЕЙСТВИЕ: КЛИК ПО КНОПКЕ
    await addIngredientButton.click();

    const orderButton = page.getByTestId('btn-add-constructor');
    await expect(orderButton).toBeVisible({ timeout: 1000 });

    await orderButton.click();

    await page.routeFromHAR('./e2e/hars/orders.har', {
      url: '**/orders',
      update: true
    });
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

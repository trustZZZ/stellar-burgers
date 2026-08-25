import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from 'react-redux';
import { selectBurgerConstructor } from '@slices/burgerSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  /** TODO: взять переменную из стора */
  const burgerConstructor = useSelector(selectBurgerConstructor);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: Record<string, number> = {};
    if (bun) {
      counters[bun._id] = 2;
    }
    ingredients.forEach((ingredient) => {
      const id = ingredient._id;
      if (!counters[id]) {
        counters[id] = 0;
      }
      counters[id]++;
    });
    return counters;
  }, [burgerConstructor.ingredients.length, burgerConstructor.bun._id]);
  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});

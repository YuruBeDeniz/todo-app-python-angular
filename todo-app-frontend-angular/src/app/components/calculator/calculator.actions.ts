import { createAction, props } from "@ngrx/store";


export const increment = createAction(
  '[Calculator Component] Increment',
  props<{ num: number }>()
);

export const decrement = createAction(
  '[Calculator Component] Decrement',
  props<{ num: number }>()
);

export const multiply = createAction(
  '[Calculator Component] Multiply',
  props<{ num: number}>()
);

export const divide = createAction(
  '[Calculator Component] Divide',
  props<{ num: number }>()
);
export const reset = createAction('[Calculator Component] reset');  

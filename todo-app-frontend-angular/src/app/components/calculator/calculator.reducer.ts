import { createReducer, on } from "@ngrx/store";
import { increment, decrement, reset, multiply, divide } from "./calculator.actions";

const initialState = 0;

export const calculatorReducer = createReducer(
    initialState,
    on(increment, (state, { num }) => state + num),
    on(decrement, (state, { num }) => state - num),
    on(multiply, (state, { num }) => state * num),
    on(divide, (state, { num }) => num !== 0 ? state / num : state),
    on(reset, () => initialState),
)
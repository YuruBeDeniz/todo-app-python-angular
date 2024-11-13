import { createFeatureSelector, createSelector } from "@ngrx/store";


export const selectCalculatorState = createFeatureSelector<number>('calculate');

export const selectCurrentValue = createSelector(
    selectCalculatorState,
    (state) => state
)

/* 
When you register a reducer in your NgRx store
(often in the StoreModule.forRoot or StoreModule.forFeature call), 
you specify a key for each feature slice. it is 'calculate' in this case.
this key is first stored under app.config.ts
*/

/* 
createFeatureSelector<number>('calculate'); 
it is number here but if we'd have a State object in reducer, 
we'd use that instead
*/

/* 
the key 'calculate' represents the calculatorReducer state slice within the store. 
When you use createFeatureSelector with 'calculate', 
it references this key to access the entire calculatorReducer state.
*/

/* 
The main reason for using createFeatureSelector 
is to access a specific feature slice directly, 
without needing to specify the path to it each time you want to create a selector. 
*/
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { calculatorReducer } from './components/calculator/calculator.reducer';
import { provideEffects } from '@ngrx/effects';
import { todoListReducer } from './components/todo-list/todo-list-reducer';
import { TodoListEffects } from './components/todo-list/todo-list.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideStore({ calculate: calculatorReducer, todos: todoListReducer }),
    provideEffects([TodoListEffects])
]
};

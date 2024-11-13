import { createAction, props } from "@ngrx/store";
import { Todo } from "../../models/todo.model";

export const getTodos = createAction('[TodoList Component] Get Todos');
export const todosFetched = createAction('[TodoList API] Todos Fetched', props<{ todos: Todo[] }>());
export const addTodo = createAction('[TodoList Component] Add Todo', props<{ todo: Todo }>());
export const todoAdded = createAction('[TodoList API] Todo Added', props<{ todo: Todo }>());
export const updateTodo = createAction('[TodoList Component] Update Todo', props<{ todo: Todo }>());
export const todoUpdated = createAction('[TodoList API] Todo Updated', props<{ todo: Todo }>());

/* 
props<{ todos: Todo[] }> This is how we define the shape of the payload that the action carries.
props<{ todo: Todo }>() indicates that when we dispatch this action, 
we must provide an object with a property called todo of type Todo.
*/
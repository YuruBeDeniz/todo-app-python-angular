import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
import { todoAdded, todosFetched, todoUpdated } from './todo-list.actions';

export const initialState: Todo[] = [];

export const todoListReducer = createReducer(
  initialState,
  on(todosFetched, (state, { todos }) => [...todos]),
  on(todoAdded, (state, { todo }) => [...state, todo]),
  on(todoUpdated, (state, { todo }) => 
    state.map((t) => (t._id === todo._id? {...t,...todo } : t)))
);

/* 
state is the current state before this action is applied.
todos is the payload of the todosFetched action.
*/
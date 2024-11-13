import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { TodoService } from '../../../services/todo.service';
import { addTodo, getTodos, todoAdded, todosFetched, todoUpdated, updateTodo } from './todo-list.actions';

@Injectable()
export class TodoListEffects {
  getTodos$;
  addTodo$;
  updateTodo$;

  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) {
    this.getTodos$ = createEffect(() =>
      this.actions$.pipe(
        ofType(getTodos),
        switchMap(() =>
          this.todoService.getTodos().pipe(
            tap(todos => console.log("Todos from Effect:", todos)),
            map(todos => todosFetched({ todos })),
            catchError(() => EMPTY)
          )
        )
      )
    );
  
    this.addTodo$ = createEffect(() =>
      this.actions$.pipe(
        ofType(addTodo),
        switchMap(({ todo }) => 
          this.todoService.addTodo(todo).pipe(
            map(addedTodo => todoAdded({ todo: addedTodo })),
            catchError(() => EMPTY)
          )
        )
      )
    );
  
    this.updateTodo$ = createEffect(() =>
      this.actions$.pipe(
        ofType(updateTodo),
        switchMap(({ todo }) => {
          console.log("Effect received todo:", todo);
  
          if (!todo.id) {
            console.error("Error: Todo ID is missing in effect");
            return EMPTY;
          }
  
          return this.todoService.updateTodo(todo).pipe(
            map(updatedTodo => todoUpdated({ todo: updatedTodo })),
            catchError(() => EMPTY)
          );
        })
      )
    );
    
  }
}

/* 
exhaustMap(): Used for fetching data to avoid overlapping HTTP calls.
switchMap(): Used for adding and updating data. It cancels any ongoing requests if a new one comes in.
*/


/* 
Cannot read properties of undefined (reading "pipe")
compiler error was solved with the below ticket
https://github.com/ngrx/platform/issues/3654
*/
import { Component, OnInit } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { Todo } from '../../models/todo.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getTodos, addTodo, updateTodo } from './todo-list.actions';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  title = '';

  constructor(
    private store: Store<{ todos : Todo[] }>,
  ) {
    this.todos$ = this.store.select(state => state.todos);
  }  

  ngOnInit(): void {
    this.store.dispatch(getTodos())
  }

  addTodo(): void {
    const newTodo: Todo = { title: this.title, completed: false };
    this.store.dispatch(addTodo({ todo: newTodo }));
    this.title = '';
  }

  onIsCompleted(todo: Todo): void {
    this.store.dispatch(updateTodo({ todo }));
  }
}





/* 

import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { TodoComponent } from '../todo/todo.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  title = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  addTodo(): void {
    const newTodo: Todo = { title: this.title, completed: false };
    this.todoService.addTodo(newTodo).subscribe((todo) => {
      this.todos.push(todo);
      this.title = '';
    });
  }

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  onIsCompleted(todo: Todo): void {
    this.todoService.updateTodo(todo).subscribe();
  }
}
*/
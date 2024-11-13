import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Todo } from '../../models/todo.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [NgClass],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})

export class TodoComponent {
  @Input() todo!: Todo;
  @Output() completedChanged = new EventEmitter<Todo>();

  toggleComplete(): void {
    const updatedTodo: Todo = { 
      _id: this.todo._id || this.todo.id, // Handle both cases
      title: this.todo.title,
      completed: !this.todo.completed
    };
    console.log("Updated Todo:", updatedTodo);

    if (updatedTodo._id) {
      this.completedChanged.emit(updatedTodo);
    } else {
      console.error("Error: Todo ID is missing in toggleComplete");
    }
  }
}

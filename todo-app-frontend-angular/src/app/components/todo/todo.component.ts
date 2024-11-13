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

  ngOnInit(): void {
    // Now, this will have the correct value
    console.log("Todo in ngOnInit:", this.todo);
  }


  toggleComplete(): void {
    const updatedTodo: Todo = { 
      id: this.todo.id,
      title: this.todo.title,
      completed: !this.todo.completed
    };
    console.log("Updated Todo:", updatedTodo);

    if (updatedTodo.id) {
      this.completedChanged.emit(updatedTodo);
    } else {
      console.error("Error: Todo ID is missing in toggleComplete");
    }
  }
}

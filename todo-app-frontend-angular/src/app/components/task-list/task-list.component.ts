import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { TaskComponent } from '../task/task.component';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { Task } from '../../models/task.model';
import { catchError, interval, switchMap, throwError, timer } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  outputs: ['completedChanged'],
  /* changeDetection: ChangeDetectionStrategy.OnPush, */ 
})
export class TaskListComponent {
  tasks = signal<Task[]>([]);
  taskForm!: FormGroup;
  errorMessage: string = '';
  isFetching = signal<boolean>(false);

  constructor(private taskService: TaskService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    //initilize form group inside ngOnInit so that:
    //the form is set up only after all necessary components and services are available.
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required]
    });

    this.getTasks();
  }

  addTask(): void {
    const newTask: Task = {
      title: this.taskForm.value.title,
      completed: false
    };
    
    // Add task to database and update the signal
    this.taskService.addTask(newTask)
      .pipe(catchError((error) => { 
        console.error(error);
        return throwError(() => new Error("Error adding task."))}
      ))
      .subscribe({
      next: (task) => {
        this.tasks.update((tasks) => [...tasks, task]);
        this.taskForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.message;
        
      },
      complete: () => {
        console.log('Add task request completed.');
      }
    });
  }

  getTasks(): void {
    this.isFetching.set(true); 
  
    timer(1000).pipe(
      switchMap(() => this.taskService.getTasks())  
    ).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);  
      },
      error: (err) => {
        this.errorMessage = 'Error fetching tasks.';
        console.error(err);
      },
      complete: () => {
        this.isFetching.set(false);  
        console.log('Get tasks request completed.');
      }
    });
  }

  
 
/* //check how to make this work
get taskss() { 
    return this.taskService.getTasks();
  } 
  */

  onCompletedChanged(task: Task): void {
    this.taskService.updateTask(task).subscribe();
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value; 
    console.log('Input value:', inputValue);
  }

  onDeleteTask(id: string): void {
    if(!id) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log("Task deleted successfully");
        this.getTasks();
      },
      error: (err) => {
        this.errorMessage = "Error deleting task";
        console.error(err);
      }
    });
  }
}


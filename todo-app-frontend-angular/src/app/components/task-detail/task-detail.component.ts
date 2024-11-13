import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { map, retry, Subscription } from 'rxjs';
import type { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})

export class TaskDetailComponent {
  task!: Task;
  taskForm!: FormGroup;
  subscription!: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private taskService: TaskService, 
    private formBuilder: FormBuilder, 
    private router: Router
  ) {}

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (taskId) {
      this.subscription =  this.taskService.getTaskDetails(taskId).subscribe((task) => {
        this.task = task;

        this.taskForm = this.formBuilder.group({
          title: [this.task.title],
        })
      });
    }
  }

  handleSubmit() {
    console.log(this.taskForm.value)
    const updatedTask: Task = {
      ...this.task,
      title: this.taskForm.value.title
    }

    this.subscription = this.taskService.updateTask(updatedTask)
    .pipe(
      retry(3),
      map((response: Task) => {
        return {
          ...response,
          title: response.title.toUpperCase(), 
          updatedAt: new Date() 
        };
      })
    )
    .subscribe({
      next: (response) => {
        this.task = response;
        console.log('Task updated:', response);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      console.log('Unsubscribed from task observable');
    }
  }
}

/* 
this.taskService.updateTask(updatedTask)
  .pipe(
    retry(3),  // Retry up to 3 times if the request fails
    map((response) => {
      // Modify the response before handling it
      return { ...response, additionalData: true };
    })
  )
  .subscribe({
    next: (response) => {
      console.log('Task updated:', response);
      this.router.navigate(['/tasks']);
    },
    error: (error) => {
      console.error('Failed after 3 retries:', error);
    }
  });

*/
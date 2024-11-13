import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import type { Todo } from "../app/models/todo.model";

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiUrl = 'http://localhost:8000/api/todos';

  constructor(private http: HttpClient) {}

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  getTodos(): Observable<Todo[]> { 
    return this.http.get<Todo[]>(this.apiUrl);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const id = todo._id || todo.id; // Handle both cases
  
    if (!id) {
      console.error("Todo ID is missing in service");
      throw new Error("Todo ID is required for updating");
    }
  
    console.log("Sending PUT request to update todo with ID:", id);
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }
}

import { Component, DestroyRef, inject, NgZone, OnInit } from '@angular/core';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { interval, Observable, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent  {
  title = 'todo-app-frontend'
}

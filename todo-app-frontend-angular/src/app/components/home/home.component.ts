import { Component } from '@angular/core';
import { CounterComponent } from "../counter/counter.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CounterComponent, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  initialCount = 18;
  today = new Date();
  name = 'Deniz';

  onCountChange(newCount: number) {
    this.initialCount = newCount;
  }
}

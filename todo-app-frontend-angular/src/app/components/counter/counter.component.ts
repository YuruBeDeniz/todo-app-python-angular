import { Component, EventEmitter, Input, Output, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {
  parentCount = input(0, {
    alias: 'parentCountWithSignal',
    transform: (value: string | number) => Number(value) 
  });

  
  localCount = signal(0);

  @Output() countChange = new EventEmitter<number>();

  constructor() {
    // Use effect to synchronize the local signal with the parent input signal
    effect(() => {
      this.localCount.set(this.parentCount());  // Sync whenever parentCount changes
    },
    { allowSignalWrites: true }
    );
  }

  updateCount(amount: number): void {
    // Update the local signal value & parentSignal cant be updated
    // as an Input Signal is for receiving values from parents
    // it should be read only
    this.localCount.update(currentValue => (currentValue || 0) + amount);
    this.countChange.emit(this.localCount());
  }
}



/* 
  @Input() count: number = 0; 
  @Output() countChange = new EventEmitter<number>();

  updateCount(amount: number): void {
    this.count = (this.count || 0) + amount; 
    this.countChange.emit(this.count);
  }
*/



/* 
  @Input() set count(value: number) {
    this.countSignal.set(value);
  }
  @Output() countChange = new EventEmitter<number>();

  countSignal = signal(0)

  updateCount(amount: number): void {
    console.log(this.countSignal()) //in the first increment, it is undefined, why?
    this.countSignal.update(currentValue => (currentValue|| 0) + amount);
    this.countChange.emit(this.countSignal());
  }
*/

/* 
You cannot use .update() on an InputSignal because it's designed to only receive values from the parent.
Use a local signal for internal state management, and sync it with the input signal using ngOnInit() or whenever the input changes.
This way, you can handle updates inside the child component while respecting the parent-child data flow.
*/
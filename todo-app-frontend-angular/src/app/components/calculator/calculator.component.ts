import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { increment, decrement, reset, multiply, divide } from './calculator.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectCurrentValue } from './calculator.selectors';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  /* changeDetection: ChangeDetectionStrategy.OnPush */
})
export class CalculatorComponent {
  calculate$: Observable<number>
  displayValue = 0
  num: number = 0
  errorMessage = signal<string>("")

  hesap = 0

  art() {
    this.hesap++
    console.log('Hesap artti:', this.hesap);
  }

  principal = 0;
  rate = 0;
  time = 0;
  showInterest = signal(false);

  // Computed signal to calculate interest lazily
  compoundInterest = computed(() => {
    if (this.showInterest()) {
      return this.principal * Math.pow(1 + this.rate / 100, this.time);
    }
    return 0;
  });

  calculateInterest() {
    this.showInterest.set(true);  // Triggers the calculation only when requested
  }

  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  incrementing() {
    this.count.update(value => value + 1);
  }

  constructor(private store: Store<{ calculate : number }>) {
    //without selectCurrentValue, we'd use 'calculate' key coming from app.config.ts
    this.calculate$ = store.select(selectCurrentValue)

    this.calculate$.subscribe(value => {
      this.displayValue = value;
    });
    console.log('Calculator Component rendered');
  }

  increment() {
    this.errorMessage.set("")
    this.store.dispatch(increment({ num: this.num }));
  }

  decrement() {
    this.errorMessage.set("")
    this.store.dispatch(decrement({ num: this.num }));
  }

  reset() {
    this.store.dispatch(reset());
    this.num = 0
    this.displayValue = 0
    this.errorMessage.set("")
  }

  multiply() {
    this.errorMessage.set("")
    this.store.dispatch(multiply({ num: this.num }));
  }

  divide() {
    this.errorMessage.set("");
    if(this.num !== 0) {
      this.store.dispatch(divide({ num: this.num}));
    } else {
      this.errorMessage.update(value => "Cannot divide by zero!")
    }
  }
}

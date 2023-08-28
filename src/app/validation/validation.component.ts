import { Component } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent {

  constructor(private mainService: MainService) { }

  enteredDigits: number[] = [];

  get numberFromDigitsArray(): number {
    return this.convertDigitsArrayToNumber(this.enteredDigits);
  }

  convertDigitsArrayToNumber(digits: number[]): number {
    let number = 0;
    for (let digit of digits) {
      number = number * 10 + digit;
    }
    return number;
  }

  resetDigits(): void {
    this.enteredDigits = [];
  }

  updateDigits(digit: number): void {
    if (this.enteredDigits.length === 0 && digit === 0) {
      // Prevent adding zero as the first digit
      return;
    }
  
    if (this.enteredDigits.length < 10) {
      this.enteredDigits.push(digit);
    }
  }
  

  backspace(): void {
    if (this.enteredDigits.length > 0) {
      this.enteredDigits.pop();
    }
  }

  submit(): void {
    if ((this.mainService.turnState < 5) && this.enteredDigits.length > 0) {
      this.mainService.updateGuesses(this.numberFromDigitsArray);
      this.resetDigits();
    }
  }

}
import { Component } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-guesses',
  templateUrl: './guesses.component.html',
  styleUrls: ['./guesses.component.css']
})
export class GuessesComponent {
  constructor(public mainService: MainService) { }

  getStyleForDigit(guessIndex: number, digitIndex: number): any {
    return this.mainService.guesses[guessIndex].style[digitIndex];
  }

}
import { Component } from '@angular/core';
import { MainService } from './main.service';

import { InformationComponent } from './information/information.component';
import { ValidationComponent } from './validation/validation.component';
import { GuessesComponent } from './guesses/guesses.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'property_game';
  constructor() { }

}

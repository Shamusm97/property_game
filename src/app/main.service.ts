import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  servicePopulated: Promise<void>;

  imgURLs: string[] = [];
  city: string = '';
  suburb: string = '';
  address: string = '';
  sqrft: number = 0;
  bedrooms: number = 0;
  bathrooms: number = 0;
  price: number = 0;
  priceDigitArray: (number | null)[] = new Array(9).fill(null);

  guesses: {guessIndex: number, 
            guessNumber: number, 
            guessDigitArray: (number | null)[],
            result: string, 
            style: { [key: string]: string }[] }[] = [];

  turnState: number = 0;

  constructor(private http: HttpClient) {
    this.servicePopulated = this.populateMainService();
  }

  wordle = (guess: string, solution: string) => {

    const extendedSolution = solution.padEnd(9, ' ')
    const extendedGuess = guess.padEnd(9, ' ')

    const splitSolution = extendedSolution.split('')
    const splitGuess = extendedGuess.split('')
  
    const solutionCharsTaken = splitSolution.map((_) => false)
  
    const statuses = Array.from(Array(guess.length))
  
    /*
     Correct Cases
    */
  
    splitGuess.forEach((letter, i) => {
      if (letter === splitSolution[i]) {
        statuses[i] = {background: '#538d4e'}
        solutionCharsTaken[i] = true
        return
      }
    })
  
    /*
     Absent Cases
    */
  
    splitGuess.forEach((letter, i) => {
      if (statuses[i]) return
  
      if (!splitSolution.includes(letter)) {
        statuses[i] = {background: '#3a3a3c'}
        return
      }
  
      /*
      Present Cases
      */
  
      const indexOfPresentChar = splitSolution.findIndex(
        (x, index) => x === letter && !solutionCharsTaken[index]
      )
  
      if (indexOfPresentChar > -1) {
        statuses[i] = {background: '#b59f3b'}
        solutionCharsTaken[indexOfPresentChar] = true
        return
      } else {
        statuses[i] = {background: '#3a3a3c'}
        return
      }
    })

    return statuses
  }

  convertNumberToDigitsArray(number: number): (number | null)[] {
    const digitsArray: (number | null)[] = new Array(9).fill(null);
    const digitString = number.toString();
  
    let index = 0;
    while (number > 0 && index < digitString.length) {
      digitsArray[index] = parseInt(digitString[index]);
      index++;
    }  
    return digitsArray;
  }  

  updateGuesses(guessNumber: number): void {
  
    if (this.turnState == 5) {
      return;
    }

    let newGuessIndex = this.guesses.length + 1;
    let newResult = "";

    this.guesses.push({ guessIndex: newGuessIndex, 
                        guessNumber: guessNumber, 
                        guessDigitArray: this.convertNumberToDigitsArray(guessNumber),
                        result: newResult, 
                        style: this.wordle(guessNumber.toString(), this.price.toString())});
    console.log("MainService! updated guesses: ", this.guesses);
    this.turnState = this.checkState();
  }

  checkState(): number {
    return this.guesses.length;
  }

  getPropertyData(): Observable<any> {
    return this.http.get('assets/db.json');
  }

  async populateMainService(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.getPropertyData().pipe(
          catchError(() => []) // Handle error by returning an empty array
        )
      );

      if (data && data.length > 0) {
        const randomNumber = Math.floor(Math.random() * data.length);
        const randomItem = data[randomNumber];

        this.imgURLs = randomItem.imgURLs;
        this.city = randomItem.city;
        this.suburb = randomItem.suburb;
        this.address = randomItem.address;
        this.sqrft = randomItem.sqrft;
        this.bedrooms = randomItem.bedrooms;
        this.bathrooms = randomItem.bathrooms;
        this.price = randomItem.price;
        this.priceDigitArray = this.convertNumberToDigitsArray(this.price);

        console.log("MainService! populated with: ", randomItem);
      }
    } catch (error) {
      console.error("Error populating MainService: ", error);
    }
  }
}
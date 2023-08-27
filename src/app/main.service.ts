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
            difference: number, 
            style: { [key: string]: string }[] }[] = [];

  outOfGuesses: boolean = false;

  constructor(private http: HttpClient) {
    this.servicePopulated = this.populateMainService();
  }

  updateGuessLineStyles(guessNumber: number): { [key: string]: string }[] {
    const guessDigitArray: (number | null)[] = this.convertNumberToDigitsArray(guessNumber);
    const priceDigitArray: (number | null)[] = this.convertNumberToDigitsArray(this.price);
  
    const styles: { [key: string]: string }[] = new Array(9).fill({});
  
    for (let i = 0; i < 9; i++) {
      if (guessDigitArray[i] === priceDigitArray[i]) {
        if (guessDigitArray[i] === null) {
          // no digit
          styles[i] = { 'background-color': 'white' };
          break;
        }
        // correct digit, correct position
        styles[i] = { 'background-color': 'green' };
      } else if (priceDigitArray.includes(guessDigitArray[i])) {
        // correct digit, wrong position
        styles[i] = { 'background-color': 'yellow' };
      } else {
        // wrong digit
        styles[i] = { 'background-color': 'red' };
      }
    }
    return styles;
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

    this.outOfGuesses = this.checkState();
    if (this.outOfGuesses) {
      return;
    }

    let newGuessIndex = this.guesses.length + 1;
    let newDifference = Math.abs(this.price - guessNumber);
    let newResult = "";
    if (newDifference === 0) {
      newResult = "Correct!";
    }
    else if (newDifference < 10000) {
      newResult = "Very Close!";
    }
    else if (newDifference < 50000) {
      newResult = "Close!";
    }
    else if (newDifference < 100000) {
      newResult = "Not Close!";
    }
    else {
      newResult = "Very Far!";
    }
    this.guesses.push({ guessIndex: newGuessIndex, 
                        guessNumber: guessNumber, 
                        guessDigitArray: this.convertNumberToDigitsArray(guessNumber),
                        result: newResult, 
                        difference: newDifference, 
                        style: this.updateGuessLineStyles(guessNumber)});
    console.log("MainService! updated guesses: ", this.guesses);
    this.outOfGuesses = this.checkState();
  }

  checkState(): boolean {
    if (this.guesses.length > 4) {
      return true;
    }
    else {
      return false;
    }
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
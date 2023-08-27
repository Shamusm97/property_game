import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InformationComponent } from './information/information.component';
import { ValidationComponent } from './validation/validation.component';
import { GuessesComponent } from './guesses/guesses.component';


import { MainService } from './main.service';
@NgModule({
  declarations: [
    AppComponent,
    InformationComponent,
    ValidationComponent,
    GuessesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [MainService],  
  bootstrap: [AppComponent]
})
export class AppModule { }

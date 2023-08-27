import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  images: string[] = [];

  constructor(public mainService: MainService) { }

  async ngOnInit() {
    await this.mainService.servicePopulated;
    this.images = this.mainService.imgURLs
  }

}

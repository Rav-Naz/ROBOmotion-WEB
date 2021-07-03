import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  {

  timeToEvent: number;

  constructor() {
    let eventDate = new Date(2021,10,21,10,0,0);
    let now = new Date();
    this.timeToEvent = eventDate.getTime() - now.getTime();
  }


}

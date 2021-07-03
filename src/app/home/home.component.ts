import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  {

  timeToEvent: number;

  constructor() {
    let eventDate = new Date(2021,10,21,9,0,0);
    this.timeToEvent = eventDate.getTime() - new Date().getTime();
    setInterval(() => {
      this.timeToEvent = eventDate.getTime() - new Date().getTime();
    }, 1000);
  }


}

import { EventDescription } from './../models/event-description.model';
import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('switch', [

      state('start', style({
        opacity: 0,
        transform: 'translateY(-2rem)'
      })),
      state('end', style({
        opacity: 0,
        transform: 'translateY(10rem)'
      })),

      transition('void => start', [
        animate('0.2s ease-in')
      ]),
      transition('void => end', [
        animate('0.2s ease-out')
      ]),
      transition('end => void', [
        animate('0.2s ease-in')
      ]),
      transition('start => void', [
        animate('0.2s ease-out')
      ]),
      transition('start => end', [
        animate('0s')
      ]),
      transition('end => start', [
        animate('0s')
      ]),
    ])
  ],
})
export class HomeComponent {

  eventsList: Array<EventDescription> = new Array(
    { id: 1, name: 'Tournament', description: 'ZXCZXCZXC', icon: '' },
    { id: 2, name: 'Hackaton', description: 'ASDASD', icon: '' },
    { id: 3, name: 'Workshops', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin urna turpis, suscipit ut nunc ac, consectetur aliquet nibh. Etiam laoreet libero vestibulum arcu aliquam, at tincidunt nunc dapibus. Phasellus eget lectus lobortis, mollis justo nec, feugiatvelit. Sed sodales metus diam, tristique efficitur diam.', icon: '' },
  );
  selectedEventIndex: number = 1;
  timeToEvent: number;
  private switchTimer: any;
  public switchAnimationStateName: 'start' | 'void' | 'end' = 'void';

  constructor() {
    let eventDate = new Date(2021, 10, 21, 9, 0, 0);
    this.timeToEvent = eventDate.getTime() - new Date().getTime();
    setInterval(() => {
      this.timeToEvent = eventDate.getTime() - new Date().getTime();
    }, 1000);
    this.switchTimer = setInterval(async () => {
      await this.onSwitchEvent(this.selectedEventIndex % this.eventsList.length + 1);
    }, 5000)
  }

  async onSwitchEvent(eventIndex: number) {
    if (eventIndex == this.selectedEventIndex) return;
    let temp = Math.abs(eventIndex - this.selectedEventIndex);
    for (let index = 0; index < temp; index++) {
      if (eventIndex < this.selectedEventIndex) {
        this.switchAnimationStateName = 'end';
        setTimeout(() => {
          this.switchAnimationStateName = 'start';
          this.selectedEventIndex -= 1;
          setTimeout(() => {
            this.switchAnimationStateName = 'void';
          }, 200);
        }, 200);
      }
      else {
        this.switchAnimationStateName = 'start';
        setTimeout(() => {
          this.switchAnimationStateName = 'end';
          this.selectedEventIndex += 1;
          setTimeout(() => {
            this.switchAnimationStateName = 'void';
          }, 200);
        }, 200);
      }
    }
    // reset interval
  }

  descriptionOfSelectedEvent() {
    return this.eventsList.find((event) => event.id === this.selectedEventIndex)?.description;
  }

}

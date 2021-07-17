import { Patreon } from './../models/patreon';
import { EventDescription } from './../models/event-description.model';
import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Category } from '../models/category';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

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
        animate(`0.2s ease-in`)
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
    { id: 1, name: 'Tournament', description: 'A competition for teams or single players in which a series of games is played, and the winners of each game play against each other until only one winner is left', icon: 'la-trophy' },
    { id: 2, name: 'Hackaton', description: 'A developer event where IT professionals and other software developers, such as graphic designers, interface developers and project managers, face a specific design problem. Hackathons take place over a short period of time, usually over the course of a day or weekend. The task to be performed is announced on the day of the competition opening. Only the work done during the event is taken into account when judging.', icon: 'la-laptop-code' },
    { id: 3, name: 'Workshops', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin urna turpis, suscipit ut nunc ac, consectetur aliquet nibh. Etiam laoreet libero vestibulum arcu aliquam, at tincidunt nunc dapibus. Phasellus eget lectus lobortis, mollis justo nec, feugiatvelit. Sed sodales metus diam, tristique efficitur diam.', icon: 'la-network-wired' },
    );
  categories: Array<Category> = new Array(
    {id: 1, name: 'Line Follower', description: 'Mauris lacinia dui ac dui porttitor, at maximus nisl sollicitudin. Vivamus at aliquet enim. Cras tempor augue neque, at consequat est rhoncus ac. Praesent sagittis consequat justo vel scelerisque. Etiam blandit euismod nisl. Etiam ligula eros, fringilla eu iaculis vel, tempor sed turpis. Sed congue vehicula ex, mattis egestas nulla accumsan ac. Quisque quis est rhoncus, venenatis ipsum a, tristique ante.' , icon: 'linefollower.svg', linkToRegulation: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 2, name: 'Sumo', description: 'Mauris lacinia dui ac dui porttitor, at maximus nisl sollicitudin. Vivamus at aliquet enim. Cras tempor augue neque, at consequat est rhoncus ac. Praesent sagittis consequat justo vel scelerisque. Etiam blandit euismod nisl. Etiam ligula eros, fringilla eu iaculis vel, tempor sed turpis. Sed congue vehicula ex, mattis egestas nulla accumsan ac. Quisque quis est rhoncus, venenatis ipsum a, tristique ante.', icon: 'linefollower.svg', linkToRegulation: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 3, name: 'Ketchup house', description: 'Mauris lacinia dui ac dui porttitor, at maximus nisl sollicitudin. Vivamus at aliquet enim. Cras tempor augue neque, at consequat est rhoncus ac. Praesent sagittis consequat justo vel scelerisque. Etiam blandit euismod nisl. Etiam ligula eros, fringilla eu iaculis vel, tempor sed turpis. Sed congue vehicula ex, mattis egestas nulla accumsan ac. Quisque quis est rhoncus, venenatis ipsum a, tristique ante.', icon: 'linefollower.svg', linkToRegulation: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 4, name: 'Humanoid sprint', description: 'Mauris lacinia dui ac dui porttitor, at maximus nisl sollicitudin. Vivamus at aliquet enim. Cras tempor augue neque, at consequat est rhoncus ac. Praesent sagittis consequat justo vel scelerisque. Etiam blandit euismod nisl. Etiam ligula eros, fringilla eu iaculis vel, tempor sed turpis. Sed congue vehicula ex, mattis egestas nulla accumsan ac. Quisque quis est rhoncus, venenatis ipsum a, tristique ante.', icon: 'linefollower.svg', linkToRegulation: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 5, name: 'Freestyle', description: 'Mauris lacinia dui ac dui porttitor, at maximus nisl sollicitudin. Vivamus at aliquet enim. Cras tempor augue neque, at consequat est rhoncus ac. Praesent sagittis consequat justo vel scelerisque. Etiam blandit euismod nisl. Etiam ligula eros, fringilla eu iaculis vel, tempor sed turpis. Sed congue vehicula ex, mattis egestas nulla accumsan ac. Quisque quis est rhoncus, venenatis ipsum a, tristique ante.', icon: 'linefollower.svg', linkToRegulation: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
  );

  patreons: Array<Patreon> = new Array(
    {id: 1, patreonCategory: 0, description: 'Rektor', image: '../../assets/svg/klocki.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 0, description: 'Rektor', image: '../../assets/svg/robo_white.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Rektor', image: '../../assets/svg/robo_white.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Rektor', image: '../../assets/svg/linefollower.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Mauris lacinia dui ac dui porttitor, at maximus nisl sollicitudin. Vivamus at aliquet enim. Cras tempor augue neque, at consequat est rhoncus ac.', image: '../../assets/svg/robo_white.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Rektor', image: '../../assets/svg/robo_white.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Rektor', image: '../../assets/svg/robo_white.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Rektor', image: '../../assets/svg/robo_white.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Rektor', image: '../../assets/svg/robo_white.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
    {id: 1, patreonCategory: 1, description: 'Rektor', image: '../../assets/svg/location.svg', linkToSite: 'https://rzit.smarthost.pl/robomotion/10b.pdf'},
  );

  switchTime = 200;
  selectedEventIndex: number = 1;
  private switchTimer: any;
  public timeToEvent: number = 1000000;
  public streamLink: SafeResourceUrl | undefined = undefined;
  public timeIsUp = false;
  public switchAnimationStateName: 'start' | 'void' | 'end' = 'void';
  public eventDate = new Date(2021, 10, 21, 9, 0, 0);
  public patreonNames: Array<string> = ['Tier 1', 'Tier 2'];

  constructor(private sanitizer: DomSanitizer) {
    this.streamLink = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/5qap5aO4i9A");
    this.refreshCounter()
    setInterval(() => {
      this.refreshCounter()
    }, 1000);
    this.resetSwitchTimer();

  }

  async onSwitchEvent(eventIndex: number) {
    const switchTime = 200;
    this.resetSwitchTimer();
    if (eventIndex == this.selectedEventIndex) return;
    let temp = Math.abs(eventIndex - this.selectedEventIndex);
    for (let index = 0; index < temp; index++) {
      if (eventIndex < this.selectedEventIndex) {
        this.switchAnimationStateName = 'end';
        await this.timeout(switchTime/temp);
        this.switchAnimationStateName = 'start';
        this.selectedEventIndex -= 1;
        await this.timeout(switchTime/temp);
        this.switchAnimationStateName = 'void';
      }
      else {
        this.switchAnimationStateName = 'start';
        await this.timeout(switchTime/temp);
        this.switchAnimationStateName = 'end';
        this.selectedEventIndex += 1;
        await this.timeout(switchTime/temp);
        this.switchAnimationStateName = 'void';
      }
    }
  }

  resetSwitchTimer(): void {
    clearInterval(this.switchTimer);
    this.switchTimer = setInterval(async () => {
      await this.onSwitchEvent(this.selectedEventIndex % this.eventsList.length + 1);
    }, 10000)
  }

  refreshCounter() :void {
    this.timeToEvent = this.eventDate.getTime() - new Date().getTime();
    if(Math.floor(this.timeToEvent/1000) < 0) {
      this.timeIsUp = true;
    }
  }

  flipCard(event: Event, direction: 'front' | 'back') {
    var allFliped = document.getElementsByClassName("is-flipped") as HTMLCollectionOf<Element>;
    for (let i = 0; i < allFliped.length; i++) {
      allFliped[i].classList.remove("is-flipped");
    }
    if (direction === 'back') {
      let target = event.target as HTMLElement;
      ((target.parentElement as HTMLElement).parentElement as HTMLElement).classList.toggle('is-flipped')
    }
  }

  getAllPatreonsWithIndex(index: number) {
    return this.patreons.filter(element => element.patreonCategory === index);
  }

  openUrl(url: string): void {
    window.open(url);
  }

  get descriptionOfSelectedEvent(): string | undefined {
    return this.eventsList.find((event) => event.id === this.selectedEventIndex)?.description;
  }

  get iconOfSelectedEvent(): string {
    let icon = this.eventsList.find((event) => event.id === this.selectedEventIndex)?.icon;
    return icon == undefined ? '' : icon;
  }

  timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

}

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
import { TranslateService } from '@ngx-translate/core';
import { WindowSize } from '../models/window_size.model';
import { fromEvent, Observable } from "rxjs";

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

  constructor(private sanitizer: DomSanitizer, public translate: TranslateService) {
    this.windowSize = {height: window.innerHeight, width: window.innerWidth };
    const resizeObs = fromEvent(window, 'resize') as Observable<any>;
    resizeObs.subscribe(size => {
      if (!size) { return; }
      this.windowSize = {height: size.currentTarget.innerHeight, width: size.currentTarget.innerWidth};
    })
    this.streamLink = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/5qap5aO4i9A");
    this.refreshCounter()
    setInterval(() => {
      this.refreshCounter()
    }, 1000);
    this.resetSwitchTimer();
    translate.stream('home.event-program.eventsList').subscribe((events: Array<EventDescription>) => {
      this.eventsList = events;
    });
    translate.stream('home.competitions.categories').subscribe((categories: Array<Category>) => {
      this.categories = categories;
    });
    translate.stream('home.patreons.patreonList').subscribe((patreons: Array<Patreon>) => {
      this.patreons = patreons;
    });
    translate.stream('home.patreons.tiers').subscribe((tiers: Array<string>) => {
      this.patreonNames = tiers;
    });
  }

  eventsList: Array<EventDescription> = [];
  categories: Array<Category> = [];
  patreons: Array<Patreon> = [];
  patreonNames: Array<string> = [];

  switchTime = 200;
  selectedEventIndex: number = 1;
  private switchTimer: any;
  public timeToEvent: number = 1000000;
  public streamLink: SafeResourceUrl | undefined = undefined;
  public timeIsUp = false;
  public switchAnimationStateName: 'start' | 'void' | 'end' = 'void';
  public eventDate = new Date(2021, 10, 21, 9, 0, 0);
  public windowSize: WindowSize = { height: 1080, width: 1920};

  async onSwitchEvent(eventIndex: number) {
    const switchTime = 200;
    this.resetSwitchTimer();
    if (eventIndex == this.selectedEventIndex) return;
    if (eventIndex > this.eventsList.length) {
      eventIndex = 1
    }
    else if (eventIndex < 1) {
      eventIndex = this.eventsList.length;
    }
    if (this.isMobile) {
      if (eventIndex < this.selectedEventIndex) {
        this.switchAnimationStateName = 'end';
        await this.timeout(switchTime);
        this.switchAnimationStateName = 'start';
        this.selectedEventIndex = eventIndex;
        await this.timeout(switchTime);
        this.switchAnimationStateName = 'void';
      }
      else {
        this.switchAnimationStateName = 'start';
        await this.timeout(switchTime);
        this.switchAnimationStateName = 'end';
        this.selectedEventIndex = eventIndex;
        await this.timeout(switchTime);
        this.switchAnimationStateName = 'void';
      }

    } else {
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
  get nameOfSelectedEvent(): string | undefined {
    return this.eventsList.find((event) => event.id === this.selectedEventIndex)?.name;
  }

  get iconOfSelectedEvent(): string {
    let icon = this.eventsList.find((event) => event.id === this.selectedEventIndex)?.icon;
    return icon == undefined ? '' : icon;
  }

  get isMobile()
  {
    return this.windowSize.width <= 800;
  }

  timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

}

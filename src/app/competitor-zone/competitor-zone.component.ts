import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RobotsService } from '../services/robots.service';
import { ConstructorsService } from '../services/constructors.service';

@Component({
  selector: 'app-competitor-zone',
  templateUrl: './competitor-zone.component.html',
  styleUrls: ['./competitor-zone.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [RobotsService, ConstructorsService]
})
export class CompetitorZoneComponent{

  public timeLeft: number | undefined;
  public timeIsUp: boolean = false;


  constructor(public translate: TranslateService, public userService: UserService, private router: Router,
    public constructorService: ConstructorsService, public authService: AuthService) {
      this.refreshCounter();
    setInterval(() => {
      this.refreshCounter();
    }, 1000);
  }

  refreshCounter() :void {
    if(!this.authService.accessToModifyExpirationDate) return;
    this.timeLeft = this.authService.accessToModifyExpirationDate.getTime() - new Date().getTime();
    if(Math.floor(this.timeLeft/1000) < 0) {
      this.timeIsUp = true;
    }
  }

  get isLessThanWeek() {
    return this.timeLeft && Math.floor(this.timeLeft/1000) < 604800;
  }

  get isFirstPage() {
    return this.router.url === '/competitor-zone';
  }

}

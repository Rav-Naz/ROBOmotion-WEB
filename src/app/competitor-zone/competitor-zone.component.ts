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


  constructor(public translate: TranslateService, public userService: UserService, private router: Router, public constructorService: ConstructorsService) {
  }

  get isFirstPage() {
    return this.router.url === '/competitor-zone';
  }

}

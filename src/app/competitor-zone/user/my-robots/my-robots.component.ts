import { Robot } from './../../../models/robot';
import { RobotsService } from './../../../services/robots.service';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-robots',
  templateUrl: './my-robots.component.html',
  styleUrls: ['./my-robots.component.scss'],
  host: {
    'class': 'router-flex'
  }
})
export class MyRobotsComponent implements OnInit {

  private subs: Subscription = new Subscription;
  public userRobots: Array<Robot> | null = null;

  constructor(private authService: AuthService, private robotsService: RobotsService) { }

  ngOnInit(): void {
    const sub1 = this.robotsService.userRobots$.subscribe((data) => {
      this.userRobots = data;
    });
    this.subs?.add(sub1);
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }


}

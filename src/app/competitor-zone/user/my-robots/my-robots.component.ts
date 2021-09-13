import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CategoryMain } from './../../../models/category-main';
import { CategoriesService } from './../../../services/categories.service';
import { Robot } from './../../../models/robot';
import { RobotsService } from './../../../services/robots.service';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription, forkJoin, combineLatest } from 'rxjs';

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
  public categories: Array<CategoryMain> | null = null;

  constructor(private authService: AuthService, private robotsService: RobotsService, private categoriesService: CategoriesService, public translate: TranslateService, public router: Router) { }

  ngOnInit(): void {

    const sub1 = combineLatest(this.categoriesService.categories$, this.robotsService.userRobots$).subscribe((val) => {
      if (val[0] !== null && val[1]) {
        this.userRobots = JSON.parse(JSON.stringify(val[1]!));
        this.categories = JSON.parse(JSON.stringify(val[0]!));
        this.userRobots?.forEach((robot) => {
          const a = [...[...robot.kategorie.split(", ")].map((cat) => this.categories!.find(obj => obj.kategoria_id.toString() === cat)?.nazwa)].join(", ");
          robot.kategorie = a;
        })
      }
    })
    this.subs.add(sub1)

  }

  public editRobot(robot_uuid: any) {
    this.router.navigateByUrl(`/competitor-zone/(outlet:robot/${robot_uuid})`)
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
    console.log("onDestroy my-robots")
  }
}

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CategoryMain } from './../../../models/category-main';
import { CategoriesService } from './../../../services/categories.service';
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
  public categories: Array<CategoryMain> | null = null;

  constructor(private authService: AuthService, private robotsService: RobotsService, private categoriesService: CategoriesService, public translate: TranslateService, public router: Router) { }

  ngOnInit(): void {
    const sub1 = this.robotsService.userRobots$.subscribe((data) => {
      if(data !== null && data !== undefined) {
        this.userRobots = [...data];
      } else {return;}
      const sub2 = this.categoriesService.categories$.subscribe((data1) => {
        if(data1 !== null && data1 !== undefined) {
          this.categories = [...data1];
          // console.log(this.userRobots);
          if (this.userRobots === null || this.userRobots === undefined) return;
          for (let index = 0; index < this.userRobots!.length; index++) {
            // console.log()
            const robot = this.userRobots![index];
            robot.kategorie = [...robot.kategorie.split(", ")].map((cat) => this.categories?.find(obj => obj.kategoria_id.toString() === cat)?.nazwa).join(", ")
          }
        }
      });
      this.subs.add(sub2);
    });
    this.subs?.add(sub1);

  }

  public editRobot(robot_uuid: any) {
    this.router.navigateByUrl(`/competitor-zone/(outlet:robot/${robot_uuid})`)
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
    console.log("onDestroy my-robots")
  }
}

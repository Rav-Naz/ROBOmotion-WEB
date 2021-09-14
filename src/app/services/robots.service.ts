import { TranslateService } from '@ngx-translate/core';
import { UiService } from './ui.service';
import { BehaviorSubject } from 'rxjs';
import { ErrorsService } from './errors.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RobotsService{

  private userRobots = new BehaviorSubject<Array<any> | null>(null);

  constructor(private http: HttpService, private errorService: ErrorsService, private ui: UiService, private translate: TranslateService) {
    this.getAllRobotsOfUser();
  }

  public getAllRobotsOfUser() {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.getAllRobotsOfUser().catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      })

      if(value !== undefined) {
        this.userRobots.next(Object.assign(value.body));
      }
      resolve(value);
    });
  }

  public addRobot(nazwa: string, kategoria_id: number) {
    return new Promise<any | void>(async (resolve) => {
      const value = await this.http.addRobot(nazwa,kategoria_id).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      })

      if(value !== undefined) {
        let newRobot = value.body.robot;
        newRobot.kategorie = newRobot.kategoria_id.toString();
        newRobot.nazwa_robota = newRobot.nazwa;
        delete newRobot.nazwa;
        delete newRobot.kategoria_id;
        this.userRobots.value?.push(newRobot)
        this.ui.showFeedback("succes", this.translate.instant('competitor-zone.new-robot.success'), 2);
        resolve(newRobot);
      } else {
        resolve(null)
      }
    });
  }


  get userRobots$() {
    return this.userRobots.asObservable()
  }
}

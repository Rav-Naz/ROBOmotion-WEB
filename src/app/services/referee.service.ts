import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/services/http.service';
import { ErrorsService } from './errors.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefereeService {

  constructor (private errorService: ErrorsService, private http: HttpService, private translate: TranslateService) {}

  public getRobotsOfUserInCategory(uzytkownik_uuid: string, kategoria_id: number) {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.getRobotsOfUserInCategory(uzytkownik_uuid,kategoria_id).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    });
  }

  public checkIfRobotHasCategory(robot_uuid: string, kategoria_id: number) {
    return new Promise<any>(async (resolve, reject) => {
      const value = await this.http.checkIfRobotHasCategory(robot_uuid,kategoria_id).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    });
  }

  public checkIfUserIsConstructorOfRobot(uzytkownik_uuid: string, robot_uuid: string) {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.checkIfUserIsConstructorOfRobot(uzytkownik_uuid, robot_uuid).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    });
  }

  public callForConstructors(robot_uuid : string, stanowisko_id: number, robot_nazwa: string) {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.callForConstructors(robot_uuid, stanowisko_id, robot_nazwa).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    });
  }
}

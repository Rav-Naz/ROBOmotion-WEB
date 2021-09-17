import { Router } from '@angular/router';
import { UserService } from './user.service';
import { WebsocketService } from './websocket.service';
import { AuthService } from './auth.service';
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

  constructor(private http: HttpService, private errorService: ErrorsService, private ui: UiService, private translate: TranslateService,
     private websocket: WebsocketService, private userService: UserService, private router: Router) {
    this.getAllRobotsOfUser();
    this.websocket.getWebSocket$.subscribe((socket) => {
      socket?.on('robots/updateRobot', (data) => {
        this.WS_updateRobot(data)
      })
      socket?.on('robots/addRobotCategory', (data) => {
        this.WS_addCategory(data)
      })
      socket?.on('robots/deleteRobotCategory', (data) => {
        this.WS_deleteCategory(data)
      })
    })
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

  public updateRobot(robot_uuid: string, nazwa: string) {
    // console.log(this.userRobots.value)
    return new Promise<any>(async (resolve) => {
      const value = await this.http.updateRobot(nazwa, robot_uuid).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      })

      // console.log(value);
      if(value !== undefined) {
        // this.userRobots.next(Object.assign(value.body));
      }
      resolve(value);
    });
  }

  public WS_updateRobot(data: any) {
    const robotIndex = this.userRobots.value?.findIndex(robot => robot.robot_id === data.robot_id)
    if(robotIndex !== undefined && robotIndex !== null && robotIndex >= 0) {
      this.userRobots.value![robotIndex].nazwa_robota = data.nazwa;
      this.userRobots.next(this.userRobots.value)
    }
  }

  public WS_addCategory(data: any) {
    const robotIndex = this.userRobots.value?.findIndex(robot => robot.robot_id === data.robot_id)
    if(robotIndex !== undefined && robotIndex !== null && robotIndex >= 0) {
      let categories = ('' + this.userRobots.value![robotIndex].kategorie).slice();
      const newCategories = categories.split(', ').concat([data.kategoria_id]).sort().join(', ')
      this.userRobots.value![robotIndex].kategorie = newCategories;
      this.userRobots.next(this.userRobots.value)
    }
  }

  public WS_deleteCategory(data: any) {
    const robotIndex = this.userRobots.value?.findIndex(robot => robot.robot_id === data.robot_id)
    if(robotIndex !== undefined && robotIndex !== null && robotIndex >= 0) {
      let categories = ('' + this.userRobots.value![robotIndex].kategorie).slice();
      const newCategories = categories.split(', ').filter(cat => cat !== data.kategoria_id.toString()).sort().join(', ')
      this.userRobots.value![robotIndex].kategorie = newCategories;
      this.userRobots.next(this.userRobots.value)
    }
  }


  public WS_addConstructor(data: any) {
    console.log(data)
    const robot_uuid = data.robot_uuid;
    const path = `/competitor-zone/(outlet:robot/${robot_uuid})`;
    console.log(this.userRobots.value)
    console.log('pobieranie konstruktorów w serwisie')
    // this.userRobots.next([]);
    // this.getAllRobotsOfUser();
    // if (path && this.robotComponentGetConstructors) {
    //   this.robotComponentGetConstructors();
    // } else {
    // }
    // if(this.userService.userDetails && data.uzytkownik_uuid === (this.userService.userDetails as any).uzytkownik_uuid) {
      // this.userRobots.value![0].kategorie = "1, 2";

    // } else {
    //   const robotIndex = this.userRobots.value?.findIndex(robot => robot.robot_id === data.robot_id)

    // }
    
    // console.log(data);
    // if(robotIndex !== undefined && robotIndex !== null && robotIndex >= 0) {
    //   let categories = ('' + this.userRobots.value![robotIndex].kategorie).slice();
    //   const newCategories = categories.split(', ').filter(cat => cat !== data.kategoria_id.toString()).sort().join(', ')
    //   this.userRobots.value![robotIndex].kategorie = newCategories;
    //   this.userRobots.next(this.userRobots.value)
    // }
  }

  public WS_deleteConstructor(data: any) {
    console.log(data);

    // const robotIndex = this.userRobots.value?.findIndex(robot => robot.robot_id === data.robot_id)
    // if(robotIndex !== undefined && robotIndex !== null && robotIndex >= 0) {
    //   let categories = ('' + this.userRobots.value![robotIndex].kategorie).slice();
    //   const newCategories = categories.split(', ').filter(cat => cat !== data.kategoria_id.toString()).sort().join(', ')
    //   this.userRobots.value![robotIndex].kategorie = newCategories;
    //   this.userRobots.next(this.userRobots.value)
    // }
  }
  get userRobots$() {
    return this.userRobots.asObservable()
  }
}

import { WebsocketService } from './websocket.service';
import { Constructor } from './../models/constructor';
import { APIResponse } from './../models/response';
import { ErrorsService } from './errors.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { RobotsService } from './robots.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstructorsService {

  private getNewConstructors = new BehaviorSubject<object | null>({method: "start", data: null});

  constructor(private http: HttpService, private errorService: ErrorsService, private websocket: WebsocketService, private robotService: RobotsService) {
    this.websocket.getWebSocket$.subscribe((socket) => {
      socket?.on('robots/addConstructor', (data) => {
        this.getNewConstructors.next({method: "add", data: data})
      })
      socket?.on('robots/deleteConstructor', (data) => {
        this.getNewConstructors.next({method: "delete", data: data})
      })
    })
  }

  getConstructorsOfRobot(robot_uuid: string) {
    return new Promise<Array<Constructor>>(async (resolve) => {
      const value = await this.http.getConstructors(robot_uuid).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      }) as APIResponse
      resolve(value.body);
    });
  }

  addConstructor(uzytkownik_uuid: string, robot_uuid: string) {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.addConstructor(uzytkownik_uuid,robot_uuid).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      }) as APIResponse
      resolve(value);
    });
  }

  deleteConstructor(konstruktor_id: number, robot_uuid: string) {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.deleteConstructor(konstruktor_id,robot_uuid).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      }) as APIResponse
      resolve(value);
    });
  }

  get getNewConstructors$ () {
    return this.getNewConstructors.asObservable();
  }
  
}

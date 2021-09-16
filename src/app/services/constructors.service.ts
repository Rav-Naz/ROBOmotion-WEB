import { WebsocketService } from './websocket.service';
import { Constructor } from './../models/constructor';
import { APIResponse } from './../models/response';
import { ErrorsService } from './errors.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstructorsService {

  constructor(private http: HttpService, private errorService: ErrorsService, private websocket: WebsocketService) {
    this.websocket.getWebSocket$.subscribe((socket) => {
      socket?.on('robots/addConstructor', (data) => {
        console.log(data)
        // this.WS_updateRobot(data)
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
}

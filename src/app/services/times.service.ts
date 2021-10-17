import { UiService } from './ui.service';
import { WebsocketService } from './websocket.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './errors.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APIResponse } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class TimesService {

  private timesForPosition = new BehaviorSubject<Array<any> | null>(null);
  private actualPosition: number | null = null;

  constructor(private http: HttpService, private errorService: ErrorsService, private translate: TranslateService,
    private websocket: WebsocketService, private ui: UiService) {
    this.websocket.getWebSocket$.subscribe((socket) => {
      socket?.on('updateTimeResult', (data) => {
        this.WS_updateTimeResult(data);
      })
    })

    this.websocket.getWebSocket$.subscribe((socket) => {
      socket?.on('setTimeResult', (data) => {
        this.WS_setTimeResult(data);
      })
    })
   }

  public getAllTimesForPosiotion(stanowisko_id: number) {
    return new Promise<APIResponse | void>(async (resolve, reject) => {
      if (this.isEmptyPositionList(stanowisko_id)) {reject(); return;}
      this.actualPosition = stanowisko_id;
      const value = await this.http.getAllTimesForPosiotion(stanowisko_id).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      if(value !== undefined) {
        this.pushNewTimesForPosition(value.body);
      }
      resolve(value);
    }); 
  }

  public setTimeResult(robot_uuid : string, czas_przejazdu: number, stanowisko_id: number, kategoria_id: number) {
    return new Promise<APIResponse | void>(async (resolve) => {
      const value = await this.http.setTimeResult(robot_uuid,czas_przejazdu, stanowisko_id, kategoria_id).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    }); 
  }

  public updateTimeResult(wynik_id: number, czas_przejazdu: number) {
    return new Promise<APIResponse | void>(async (resolve) => {
      const value = await this.http.updateTimeResult(wynik_id,czas_przejazdu).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    }); 
  }

  public pushNewTimesForPosition(times: Array<any> | null) {
    const sorted = times ? times.sort((a,b) => b.wynik_id - a.wynik_id) : times;
    this.timesForPosition.next(sorted);
  }

  WS_updateTimeResult(data: any) {
    const timeIndex = this.timesForPosition.value?.findIndex(time => time.wynik_id === data?.wynik_id)
    if(timeIndex !== undefined && timeIndex !== null && timeIndex >= 0 && this.timesForPosition.value) {
      this.timesForPosition.value![timeIndex].czas_przejazdu = data?.czas_przejazdu;
      this.timesForPosition.next(this.timesForPosition.value)
    }
  }

  WS_setTimeResult(data: any) {
    if(this.actualPosition === data.stanowisko_id) {
      const new_time = data;
      delete new_time.stanowisko_id;
      this.timesForPosition.value?.push(new_time);
      this.pushNewTimesForPosition(this.timesForPosition.value);
      this.ui.showFeedback("succes", `Pomyślnie dodano nowy czas przejazdu (${new_time.wynik_id}) dla robota ${new_time.nazwa_robota}`, 3);
    }
  }

  isEmptyPositionList(stanowisko_id: number) {
    return this.timesForPosition.value && this.timesForPosition.value.length > 0 && this.actualPosition === stanowisko_id;
  }

  get timesForPosition$() {
    return this.timesForPosition.asObservable();
  }
}

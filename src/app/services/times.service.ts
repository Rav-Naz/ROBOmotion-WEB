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

  constructor(private http: HttpService, private errorService: ErrorsService, private translate: TranslateService,
    private websocket: WebsocketService) {
    this.websocket.getWebSocket$.subscribe((socket) => {
      socket?.on('updateTimeResult', (data) => {
        this.WS_updateTimeResult(data);
      })
    })
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

  public pushNewTimesForPosition(times: Array<any>) {
    this.timesForPosition.next(times);
  }

  WS_updateTimeResult(data: any) {
    const timeIndex = this.timesForPosition.value?.findIndex(time => time.wynik_id === data?.wynik_id)
    if(timeIndex !== undefined && timeIndex !== null && timeIndex >= 0 && this.timesForPosition.value) {
      this.timesForPosition.value![timeIndex].czas_przejazdu = data?.czas_przejazdu;
      this.timesForPosition.next(this.timesForPosition.value)
    }
  }

  get timesForPosition$() {
    return this.timesForPosition.asObservable();
  }
}

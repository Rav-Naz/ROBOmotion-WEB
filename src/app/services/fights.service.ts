import { UiService } from 'src/app/services/ui.service';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ErrorsService } from './errors.service';
import { TranslateService } from '@ngx-translate/core';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject } from 'rxjs';
import { APIResponse } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class FightsService {

  private fightsForPosition = new BehaviorSubject<Array<any> | null>(null);
  private actualPosition: number | null = null;

  constructor(private http: HttpService, private errorService: ErrorsService, private translate: TranslateService,
    private websocket: WebsocketService, private ui: UiService) {
      this.websocket.getWebSocket$.subscribe((socket) => {
        socket?.on('setFightResult', (data) => {
          this.WS_setFightResult(data);
        })
      })
   }

   public getAllFightsForPosiotion(stanowisko_id: number) {
    return new Promise<APIResponse | void>(async (resolve,reject) => {
      if (this.isEmptyPositionList(stanowisko_id)) {reject(); return;}
      this.actualPosition = stanowisko_id;
      const value = await this.http.getAllFightsForPosiotion(stanowisko_id).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      if(value !== undefined) {
        this.pushNewFigthsForPosition(value.body);
      }
      resolve(value);
    }); 
  }
  
   public setFightResult(walka_id: number, wygrane_rundy_robot1: number, wygrane_rundy_robot2: number ) {
    return new Promise<APIResponse | void>(async (resolve,reject) => {
      const value = await this.http.setFightResult(walka_id, wygrane_rundy_robot1, wygrane_rundy_robot2).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    }); 
  }

  public pushNewFigthsForPosition(fight: Array<any>) {
    this.fightsForPosition.next(fight);
  }

  isEmptyPositionList(stanowisko_id: number) {
    return this.fightsForPosition.value && this.fightsForPosition.value.length > 0 && this.actualPosition === stanowisko_id;
  }

  get figthsForPosition$() {
    return this.fightsForPosition.asObservable();
  }

  WS_setFightResult(data: any) {
    if(this.actualPosition === data.stanowisko_id && this.fightsForPosition.value !== null && this.fightsForPosition.value !== undefined) {
      const fight = this.fightsForPosition.value.find(f => f.walka_id === data.walka_id);
      if(fight) {
        fight.czas_zakonczenia = data.czas_zakonczenia;
        fight.wygrane_rundy_robot1 = data.wygrane_rundy_robot1;
        fight.wygrane_rundy_robot2 = data.wygrane_rundy_robot2;
        this.pushNewFigthsForPosition(this.fightsForPosition.value);
        this.ui.showFeedback("succes", `Pomyślnie ustawiono wynik walki (${fight.walka_id})`, 3);
      }
      // delete fight.stanowisko_id;
      // this.timesForPosition.value?.push(new_time);
    }
  }
}

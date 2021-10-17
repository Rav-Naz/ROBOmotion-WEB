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
    private websocket: WebsocketService) {
    this.websocket.getWebSocket$.subscribe((socket) => {
      // socket?.on('updateTimeResult', (data) => {
      // })
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

  public pushNewFigthsForPosition(fight: Array<any>) {
    this.fightsForPosition.next(fight);
    console.log(fight)
  }

  isEmptyPositionList(stanowisko_id: number) {
    return this.fightsForPosition.value && this.fightsForPosition.value.length > 0 && this.actualPosition === stanowisko_id;
  }

  get figthsForPosition$() {
    return this.fightsForPosition.asObservable();
  }
}

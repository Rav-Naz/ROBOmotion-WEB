import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ErrorsService } from './errors.service';
import { TranslateService } from '@ngx-translate/core';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FightsService {

  private fightsForPosition = new BehaviorSubject<Array<any> | null>(null);

  constructor(private http: HttpService, private errorService: ErrorsService, private translate: TranslateService,
    private websocket: WebsocketService) {
    this.websocket.getWebSocket$.subscribe((socket) => {
      // socket?.on('updateTimeResult', (data) => {
      // })
    })
   }

   public pushNewFigthsForPosition(fight: Array<any>) {
    this.fightsForPosition.next(fight);
  }

  get figthsForPosition$() {
    return this.fightsForPosition.asObservable();
  }
}

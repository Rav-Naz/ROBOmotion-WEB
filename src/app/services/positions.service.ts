import { FightsService } from './fights.service';
import { TimesService } from './times.service';
import { Position } from './../models/position';
import { Injectable, Injector } from '@angular/core';
import { UserService } from './user.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './errors.service';
import { HttpService } from 'src/app/services/http.service';
import { APIResponse } from '../models/response';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  private positions = new BehaviorSubject<Array<Position> | null>(null);

  constructor(private http: HttpService, private errorService: ErrorsService, private translate: TranslateService, private userService: UserService,
    private incjetor: Injector) {
    if (userService.isReferee) this.getAllRefereePositions;
  }

  public get getAllRefereePositions() {
    return new Promise<APIResponse | void>(async (resolve) => {
      const value = await this.http.getRefereePositions(this.userService.userUUID).catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, this.translate.instant(err.error.body));
        } else {
          this.errorService.showError(err.status);
        }
      })
      if(value !== undefined) {
        this.positions.next(value.body);
      }
      resolve(value);
    }); 
  }

  get positions$() {
    return this.positions.asObservable();
  }
}

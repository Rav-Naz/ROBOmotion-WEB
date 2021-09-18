import { ErrorsService } from './errors.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userDetails: object | null = null;
  public user = new BehaviorSubject<object | null>(null);

  constructor(private http: HttpService, private errorService: ErrorsService) { }

  public getUser() {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.getUser().catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      })
      resolve(value);
    });
  }

  get getUser$() {
    return this.user.asObservable();
  }

  get userType()
  {
    return this.userDetails ? (this.userDetails as any).uzytkownik_typ : null;
  }

  get userUUID()
  {
    return this.userDetails ? (this.userDetails as any).uzytkownik_uuid : null;
  }

  get isReferee() {
    return this.userType > 1;
  }
}

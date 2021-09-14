import { ErrorsService } from './errors.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userDetails: object | null = null;
  public userName = new BehaviorSubject<string | null>(null);

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

  get getFirstName$() {
    return this.userName.asObservable();
  }

  get userType()
  {
    return (this.userDetails as any).uzytkownik_typ;
  }

  get isReferee() {
    return this.userType > 1;
  }
}

import { BehaviorSubject } from 'rxjs';
import { ErrorsService } from './errors.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RobotsService{

  private userRobots = new BehaviorSubject<Array<any> | null>(null);

  constructor(private http: HttpService, private errorService: ErrorsService) {
    this.getAllRobotsOfUser();
  }

  public getAllRobotsOfUser() {
    return new Promise<any>(async (resolve) => {
      const value = await this.http.getAllRobotsOfUser().catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      })

      if(value !== undefined) {
        resolve(value);
        this.userRobots.next(value.body);
      }
    });
  }


  get userRobots$() {
    return this.userRobots.asObservable()
  }
}

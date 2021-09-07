import { Observable, observable, BehaviorSubject } from 'rxjs';
import { UiService } from './ui.service';
import { ErrorsService } from './errors.service';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256'
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public JWT: string | null= null;
  public userDetails: object | null = null;
  public userName = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpService, private router: Router, private errorService: ErrorsService, private ui: UiService, private translate: TranslateService) {
    const details = localStorage.getItem('details');
    if (details) {
      this.SetDetails(details);
    }
  }

  SetDetails(userDetails: string | null) {
    return new Promise<void>((resolve) => {
      if(userDetails !== null) {
        const detailsParsed = JSON.parse(userDetails);
        this.userDetails = detailsParsed;
        this.JWT = detailsParsed.token;
        this.userName.next(detailsParsed.imie);
        localStorage.setItem('details', JSON.stringify(detailsParsed));
        resolve();
      } else {
        this.userName.next(null);
        this.userDetails = null;
        this.JWT = null;
        localStorage.removeItem('details');
        resolve();
      }
    });
  }

  async login(email: string, haslo: string)
  {
    return new Promise<string>(async (resolve) => {
      const value = await this.http.login(email,this.hashPassword(haslo).toString()).catch(err => {
        if(err.status === 400) {
          if(err.error.body == "Taki użytkownik nie istnieje!") {
            this.errorService.showError(err.status, this.translate.instant('competitor-zone.login.errors.not-found'));
          } else if (err.error.body == "Użytkownik nie został aktywowany") {
            this.errorService.showError(err.status, this.translate.instant('competitor-zone.login.errors.not-activated'));

          } else {
            this.errorService.showError(err.status, err.error.body);
          }
        } else if (err.status === 401) {
          this.errorService.showError(err.status, this.translate.instant('competitor-zone.login.errors.failed'));
        }
         else {
          this.errorService.showError(err.status);
        }
      })
      if(value !== undefined) {
        resolve(value);
        this.SetDetails(JSON.stringify(value.body))
        this.router.navigateByUrl('/competitor-zone').then(() => {
        })
      }
    });
  }

  async register(imie: string, nazwisko: string, email: string, haslo: string) {
    return new Promise<string>(async (resolve) => {
      const value = await this.http.register(imie,nazwisko,email,this.hashPassword(haslo).toString()).catch(err => {
        if(err.status === 400) {
          if(err.error.body == "Uzytkownik o takim email już istnieje!") {
            this.errorService.showError(err.status, this.translate.instant('competitor-zone.register.errors.duplicate'));
          } else {
            this.errorService.showError(err.status, err.error.body);
          }
        } else {
          this.errorService.showError(err.status);
        }
      })
      if(value !== undefined) {
        this.router.navigateByUrl('/login').then(() => {
          setTimeout(() => {
            this.ui.showFeedback("succes", this.translate.instant('competitor-zone.register.errors.success'), 4)
          }, 200)
        })
        resolve(value);
      }
    });
  }

  async logout()
  {
    return new Promise<void>(async (resolve) => {
      await this.SetDetails(null);
      if(this.router.url.length === 1 || (this.router.url.length > 1 && this.router.url.slice(0,2) === '/#')) {
        setTimeout(() => {
          this.ui.showFeedback('succes', this.translate.instant('competitor-zone.login.errors.logout'), 3);
        }, 400);
      } else {
        this.router.navigateByUrl('/login').then(() => {
          setTimeout(() => {
            this.ui.showFeedback('succes', this.translate.instant('competitor-zone.login.errors.logout'), 3);
          }, 400);
        });
      }
      resolve()
    });
  }

  hashPassword(haslo: string): string {
    return sha256(haslo);
  }

  get getFirstName$() {
    return this.userName.asObservable();
  }

  get isLogged()
  {
    return this.JWT !== null;
  }

  get userType()
  {
    return (this.userDetails as any).uzytkownik_typ;
  }

}

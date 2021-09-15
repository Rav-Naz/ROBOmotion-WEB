import { RobotsService } from './services/robots.service';
import { CategoriesService } from './services/categories.service';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Component, OnInit, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CategoriesService]
})
export class AppComponent implements OnInit {

  public userName: string | null = null;
  public userUUID: string | null = null;
  public isMenuOpen: boolean = false;
  public isEnglish: boolean = true;
  private subs: Subscription = new Subscription;

  constructor(public translate: TranslateService, private injector: Injector) {
    translate.addLangs(['en', 'pl']);
    const prefLanguage = localStorage.getItem("prefLang");
    if (prefLanguage == null || prefLanguage == undefined) {
      const browserLang = translate.getBrowserLang();
      this.isEnglish = browserLang !== 'pl';
      translate.setDefaultLang(browserLang === 'pl' ? browserLang : 'en');
    } else {
      this.isEnglish = prefLanguage !== 'pl';
      translate.setDefaultLang(prefLanguage);
    }
  }

  ngOnInit() {
    const sub1 = this.injector.get(UserService).getUser$.subscribe((data) => {
      const user = data as any
      this.userName = user ? user.imie : null;
      this.userUUID = user ? user.uzytkownik_uuid : null;
    })
    this.subs?.add(sub1);
  }

  switchMenu(bool?: boolean): void {
    const menuButton = document.querySelector('.navigator-menu');
    const container = document.querySelector('.navigator-outlet');
    if (bool != null && bool != undefined) {
      this.isMenuOpen = !bool;
    }
    if (this.isMenuOpen) {
      menuButton?.classList.remove('open');
      container?.classList.remove('open');
    }
    else {
      menuButton?.classList.add('open');
      container?.classList.add('open');
    }

    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout() {
    this.injector.get(AuthService).logout();
  }

  getDepth(outlet: any): void {
    return outlet.activatedRouteData['depth'];
  }
  switchLang() {
    this.isEnglish = !this.isEnglish;
    localStorage.setItem('prefLang', this.isEnglish ? 'en' : 'pl');
    this.translate.use(this.isEnglish ? 'en' : 'pl');

  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}

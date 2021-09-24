import { UiService } from './services/ui.service';
import { CategoriesService } from './services/categories.service';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmComponent } from './shared/confirm/confirm.component';

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
  public isCookies: boolean = false;
  private subs: Subscription = new Subscription;

  @ViewChild(ConfirmComponent) confirm: ConfirmComponent | null = null;

  constructor(public translate: TranslateService, private injector: Injector, private ui: UiService) {
    const cookies = localStorage.getItem('cookies');
    if(cookies) {
      this.isCookies = false;
    } else {
      this.isCookies = true;
    }
    translate.addLangs(['en', 'pl']);
    const prefLanguage = localStorage.getItem("prefLang");
    if (prefLanguage == null || prefLanguage == undefined) {
      const browserLang = translate.getBrowserLang();
      this.isEnglish = browserLang !== 'pl';
      translate.use(browserLang);
      translate.setDefaultLang(browserLang === 'pl' ? browserLang : 'en');
    } else {
      this.isEnglish = prefLanguage !== 'pl';
      translate.use(prefLanguage);
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

  ngAfterViewInit(): void {
    if (this.confirm) {
      this.ui.setConfirmComponent(this.confirm);
    }
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

  acceptCookies() {
    this.isCookies = false;
    localStorage.setItem('cookies', 'accepted');
  }

  onLogout() {
    this.injector.get(AuthService).logout();
    this.switchMenu(false);
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

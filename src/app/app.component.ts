import { AuthService } from './services/auth.service';
import { Component, OnInit, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

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
    // const socket = openSocket('http://localhost:8080', {
    //   auth: {
    //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1enl0a293bmlrX2lkIjo4LCJ1enl0a293bmlrX3V1aWQiOiIyZjM5NzgwNS1kOTI4LTExZWItOGJhNS1iOGNhM2E1YmM3ZDAiLCJ1enl0a293bmlrX3R5cCI6MiwiaWF0IjoxNjI4NzcyNDE4LCJleHAiOjE2Mjg4NTg4MTh9.53BQyw7nLpGNs2vwEoAPgLlpT1RJZlPvqqP8NhZITM8"
    //   }
    // });
    // socket.on("socketId", (data) => {
    //   console.log(data);
    // })
    // socket.on("addRobotCategory", (data) => {
    //   console.log(data);
    // })
  }

  ngOnInit() {
    this.injector.get(AuthService).getFirstName$.subscribe((data) => {
      this.userName = data;
    });
  }

  public userName: string | null = null;
  public isMenuOpen: boolean = false;
  public isEnglish: boolean = true;

  switchMenu(bool?: boolean): void {
    const menuButton = document.querySelector('.navigator-menu');
    const container = document.querySelector('.navigator-outlet');
    if(bool != null && bool != undefined) {
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
}

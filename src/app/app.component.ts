import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import openSocket from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(public translate: TranslateService) {
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

  getDepth(outlet: any): void {
    return outlet.activatedRouteData['depth'];
  }
  switchLang() {
    this.isEnglish = !this.isEnglish;
    localStorage.setItem('prefLang', this.isEnglish ? 'en' : 'pl');
    this.translate.use(this.isEnglish ? 'en' : 'pl');

  }
}

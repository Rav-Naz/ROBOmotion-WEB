import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isMenuOpen: boolean = false;

  switchMenu(): void {
    const menuButton = document.querySelector('.navigator-menu');
    const container = document.querySelector('.navigator-outlet');
    if(this.isMenuOpen) {
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
}

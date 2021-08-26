import { TranslateService } from '@ngx-translate/core';
import { UiService } from './ui.service';
import { Injectable } from '@angular/core';
import { statusCode } from '../models/status-codes';

@Injectable({
  providedIn: 'root'
})

export class ErrorsService {
  
  private messageBody: any = undefined;

  constructor(private ui: UiService, private translate: TranslateService) {
    this.translate.stream('errors.statusCodes').subscribe((bodies) => {
      this.messageBody = bodies;
    });
  }

  public showError(statusCode: statusCode, additionalMessage?: string, type?: 'succes' | 'warning' | 'error' | 'loading'): void {
    this.ui.showFeedback(type ? type : "error", this.errorBody(this.messageBody[statusCode], additionalMessage));
  }

  private errorBody(main: string, additional?: string | undefined): string {
    if (additional) {
      return main + '<br><br>:: ' + additional; 
    } else {
      return main;
    }
  }
}

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class UiService {

  private names: any = undefined;

  constructor(private toasterService: ToastrService, private translate: TranslateService) {
    this.translate.stream('errors.names').subscribe((names) => {
      this.names = names;
    });
  }

  showFeedback(typ: 'succes' | 'warning' | 'error' | 'loading', tresc: string, czas?: number)
  {
      switch (typ) {
        case 'succes':
         this.toasterService.success(tresc, (this.names ? this.names.success : "Sukces"), {timeOut: (czas ? czas : 2) * 1000});
         break;
        case 'warning':
         this.toasterService.warning(tresc, (this.names ? this.names.warning : "Uwaga!"), {timeOut: (czas ? czas : 2) * 1000});
         break;
        case 'error':
         this.toasterService.error(tresc, (this.names ? this.names.error : "Error!"), {timeOut: (czas ? czas : 2) * 1000});
         break;
        case 'loading':
         this.toasterService.info(tresc, (this.names ? this.names.loading : "Ładowanie..."), {timeOut: (czas ? czas : 2) * 1000});
         break;
      }
  }
}

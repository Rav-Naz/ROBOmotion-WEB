import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { HttpService } from 'src/app/services/http.service';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.scss']
})
export class ConfirmCodeComponent implements OnInit {

  constructor(private route: ActivatedRoute, public translate: TranslateService, private httpService: HttpService) { }

  public text:any = undefined;
  private opis:any = undefined;
  public success: boolean = false;

  async ngOnInit(): Promise<void> {
    const uzytkownik_uuid = this.route.snapshot.paramMap.get('uzytkownik_uuid');
    const kod = this.route.snapshot.paramMap.get('kod');
    const czy_na_telefon = this.route.snapshot.paramMap.get('czy_na_telefon');

    this.translate.stream('competitor-zone.confirmation-code').subscribe((opis: any) => {
      this.opis = opis;
    });

    if(typeof uzytkownik_uuid !== 'string' || typeof kod !== 'string' || typeof czy_na_telefon !== 'string') {
      this.text = this.opis.incorrect;
      return;
    }
    const value = await this.httpService.confirmCode(uzytkownik_uuid,kod,czy_na_telefon).catch(err => {
      if(err.error.body == "Uzytkownik ma już potwierdzony email.") {
        this.text = this.opis.activated;
      } else {
        this.text = err.error.body;
      }
    });

    if(value !== undefined) { this.text = this.opis.success; this.success = true}
  }

}

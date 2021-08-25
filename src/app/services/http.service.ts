import { APIResponse } from './../models/response';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://localhost:4200'
  })
  }

  confirmCode(uzytkownik_uuid: string, kod: string, czy_na_telefon: string) {
    return new Promise<any>((resolve, rejects) => {
      this.http.get(`${this.url}public/confirmCode/${uzytkownik_uuid}/${kod}/${czy_na_telefon}`).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  get getHomePageInfo(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.url}site/info`, {headers: this.headers});
  }
}

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
      'Accept': 'application/json'
  })
  }

  // ------------- PUBLIC

  confirmCode(uzytkownik_uuid: string, kod: string, czy_na_telefon: string) {
    return new Promise<any>((resolve, rejects) => {
      this.http.get(`${this.url}public/confirmCode/${uzytkownik_uuid}/${kod}/${czy_na_telefon}`).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  register(imie: string, nazwisko: string, email: string, hasloHashed: string) {
    return new Promise<any>((resolve, rejects) => {
      this.http.post(`${this.url}public/registerUser`, {
        imie: imie,
        nazwisko: nazwisko,
        email: email,
        haslo: hasloHashed
      }).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  login(email: string, hasloHashed: string) {
    return new Promise<any>((resolve, rejects) => {
      this.http.post(`${this.url}public/loginUser`, {
        email: email,
        haslo: hasloHashed
      }).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  // ------------- USER

  getUser() {
    return new Promise<any>((resolve, rejects) => {
      this.http.get(`${this.url}user/getUser`, {headers: this.headers}).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  // ------------- REFEREE

  public setNewToken(jwt: string | null) {
    if (jwt !== null) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'token': jwt
      })
    } else {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }
  }

  get getHomePageInfo(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.url}site/info`, {headers: this.headers});
  }
}

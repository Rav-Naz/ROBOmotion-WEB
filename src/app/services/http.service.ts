import { Robot } from './../models/robot';
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

  public confirmCode(uzytkownik_uuid: string, kod: string, czy_na_telefon: string) {
    return new Promise<any>((resolve, rejects) => {
      this.http.get<APIResponse>(`${this.url}public/confirmCode/${uzytkownik_uuid}/${kod}/${czy_na_telefon}`).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  public register(imie: string, nazwisko: string, email: string, hasloHashed: string) {
    return new Promise<any>((resolve, rejects) => {
      this.http.post<APIResponse>(`${this.url}public/registerUser`, {
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

  public login(email: string, hasloHashed: string) {
    return new Promise<any>((resolve, rejects) => {
      this.http.post<APIResponse>(`${this.url}public/loginUser`, {
        email: email,
        haslo: hasloHashed
      }).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  // ------------- USER

  public getUser() {
    return new Promise<any>((resolve, rejects) => {
      this.http.get<APIResponse>(`${this.url}user/getUser`, {headers: this.headers}).toPromise().then(
        (value) => { resolve(value) },
        (error) => { rejects(error) }
      );
    })
  }

  public getAllRobotsOfUser() {
    return new Promise<APIResponse>((resolve, rejects) => {
      this.http.get<APIResponse>(`${this.url}user/getAllRobotsOfUser`, {headers: this.headers}).toPromise().then(
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

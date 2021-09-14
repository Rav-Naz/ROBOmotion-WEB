import { APIResponse } from './../models/response';
import { CategoryMain } from './../models/category-main';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public categories = new BehaviorSubject<Array<CategoryMain> | null>(null);

  constructor(private http: HttpService, private errorService: ErrorsService) {
    this.getAllCategories();
  }

  public getAllCategories() {
    return new Promise<APIResponse | void>(async (resolve) => {
      const value = await this.http.getAllCategories.catch(err => {
        if(err.status === 400) {
          this.errorService.showError(err.status, err.error.body);
        } else {
          this.errorService.showError(err.status);
        }
      })

      if(value !== undefined) {
        this.categories.next(value.body);
      }
      resolve(value);
    }); 
  }

  get categories$() {
    return this.categories.asObservable();
  }
}

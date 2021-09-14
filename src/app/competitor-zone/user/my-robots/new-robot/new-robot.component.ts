import { Subscription } from 'rxjs';
import { AuthService } from './../../../../services/auth.service';
import { RobotsService } from './../../../../services/robots.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { CategoryMain } from 'src/app/models/category-main';
import {Location} from '@angular/common';


@Component({
  selector: 'app-new-robot',
  templateUrl: './new-robot.component.html',
  styleUrls: ['./new-robot.component.scss'],
  host: {
    'class': 'router-flex'
  }
})
export class NewRobotComponent {

  form: FormGroup;
  public categories: Array<CategoryMain> | null = null;
  private loading: boolean = false;
  private subs: Subscription = new Subscription;

  constructor(private formBuilder: FormBuilder, private categoriesService: CategoriesService, private robotService: RobotsService, private location: Location, private authService: AuthService) {
    this.form = this.formBuilder.group({
      robot_name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      category: [null, [Validators.required]]
    });

    const sub1 = this.categoriesService.categories$.subscribe((data) => {
      this.categories = JSON.parse(JSON.stringify(data));
    })
    this.subs.add(sub1);
  }

  onSubmit() {
    if (this.isFormGroupValid) {
      this.loading = true;
      this.robotService.addRobot(this.form.get('robot_name')?.value, this.form.get('category')?.value).finally(() => {
        this.location.back();
      })
    }
  }

  enterSubmit(event: any) {
    if(event.keyCode === 13) this.onSubmit();
  }

  get isFormGroupValid() {
    return this.form.valid && !this.isLoading && this.authService.canModify;
  }

  get isLoading() {
    return this.loading;
  }


  get categoriesOptions(): string | undefined {
    return this.categories ? JSON.stringify(Object.assign(this.categories).map((category: CategoryMain) => {
      return {value: category.nazwa, id: category.kategoria_id}
    })) : undefined;
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

}

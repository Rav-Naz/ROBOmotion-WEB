import { Constructor } from './../../../../models/constructor';
import { CategoriesService } from './../../../../services/categories.service';
import { RobotsService } from './../../../../services/robots.service';
import { AuthService } from './../../../../services/auth.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Robot } from 'src/app/models/robot';
import { CategoryMain } from 'src/app/models/category-main';
import { ConstructorsService } from 'src/app/services/constructors.service';


@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss'],
  host: {
    'class': 'router-flex'
  }
})
export class RobotComponent {

  private oldName: string = "";
  public formName: FormGroup;
  public formCategory: FormGroup;
  public formConstructor: FormGroup;
  public loading: boolean = false;
  private subs: Subscription = new Subscription;
  public robot: Robot | null = null;
  public categories: Array<CategoryMain> | null = null;
  public constructors: Array<Constructor> | null = null;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private robotsService: RobotsService, private categoriesService: CategoriesService, private constructorsService: ConstructorsService) {

    const robot_uuid = this.route.snapshot.paramMap.get('robot_uuid');
    const sub1 = combineLatest(this.categoriesService.categories$, this.robotsService.userRobots$).subscribe((val) => {
      if (val[0] !== null && val[1] !== null) {
        this.categories = JSON.parse(JSON.stringify(val[0]!));
        const robots = JSON.parse(JSON.stringify(val[1]!)) as Array<Robot>;
        const thisRobot = robots?.find((rob: any) => rob.robot_uuid == robot_uuid);
        this.robot = thisRobot ? thisRobot : null;
        // this.robot!.kategorie = this.robot!.kategorie.concat(this.robot!.kategorie);
        this.oldName = this.robot!.nazwa_robota;
        this.constructorsService.getConstructorsOfRobot(this.robot!.robot_uuid).catch(err => {}).then(constructors => {
          this.constructors = constructors as Array<Constructor>;
        });
        this.formName = this.formBuilder.group({
          robot_name: [this.oldName, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]]
        });
      }
    });
    this.subs.add(sub1);
    this.formName = this.formBuilder.group({
      robot_name: [this.oldName, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]]
    });
    this.formCategory = this.formBuilder.group({
      category: [null, [Validators.required]]
    });
    this.formConstructor = this.formBuilder.group({
      constructor_uuid: [null, [Validators.required, Validators.minLength(36), Validators.maxLength(36)]]
    });
    
  }


  onUpdateName() {
    if (this.isFormGroupNameValid) {
      this.loading = true;
      this.robotsService.updateRobot(this.robot!.robot_uuid, this.formName.get('robot_name')?.value).finally(() => {
        this.loading = false;
      })
    }
  }

  onAddCategory() {
    if (this.isFormGroupCategoryValid) {
      this.loading = true;
      this.categoriesService.addRobotCategory(this.formCategory.get('category')?.value, this.robot!.robot_uuid).finally(() => {
        this.loading = false;
      })
    }
  }

  onAddConstructor() {
    if (this.isFormGroupConstructorValid) {
      this.loading = true;
      this.constructorsService.addConstructor(this.formConstructor.get('constructor_uuid')?.value, this.robot!.robot_uuid).catch(err => console.log(err)).finally(() => {
        this.loading = false;
      })
    }
  }

  public get isChanged() {
    return this.formName.get('robot_name')?.value !== this.oldName;
  }
  public get isFormGroupNameValid() {
    return this.formName.valid && !this.isLoading && this.authService.canModify;
  }
  public get isFormGroupCategoryValid() {
    return this.formCategory.valid && !this.isLoading && this.authService.canModify && this.canAddCategory;
  }
  public get isFormGroupConstructorValid() {
    return this.formConstructor.valid && !this.isLoading && this.authService.canModify;
  }

  public get isLoading() {
    return this.loading;
  }

  public get categoriesOptions(): string | undefined {
    if (this.categories && this.robot) {
      let cats = Object.assign(this.categories) as Array<CategoryMain>;
      const kategorie_lf = [4,5,6,7,8];
      const kategorie_sumo = [12,13,14,15,16];
      const akt_lf = this.robotCategories?.filter(el => kategorie_lf.findIndex(lf => lf === el) >= 0);
      const akt_sumo = this.robotCategories?.filter(el => kategorie_sumo.findIndex(sumo => sumo === el) >= 0);
      if(akt_lf && akt_lf.length >= 2) {
        cats = cats.filter(element => kategorie_lf.findIndex(rC => rC === element.kategoria_id)! < 0);
      }
      if(akt_sumo && akt_sumo.length >= 2) {
        cats = cats.filter(element => kategorie_sumo.findIndex(rC => rC === element.kategoria_id)! < 0);
      }
      cats = cats.filter(element => this.robotCategories?.findIndex(rC => rC === element.kategoria_id)! < 0);
      return JSON.stringify(cats.map((category: CategoryMain) => {
        return {value: category.nazwa, id: category.kategoria_id};
      }));
    } else {
      return undefined;
    }
  }

  public get robotCategories() {
    return this.robot ? this.robot.kategorie.split(', ').map(el => Number(el)) : null;
  }

  public get robotConstructors() {
    return this.constructors ? this.constructors : null;
  }

  public get canAddCategory() {
    return this.robotCategories ? this.robotCategories?.length < 4 : false;
  }

  public getCategoryName(kategoria_id: string | number) {
    let id = typeof kategoria_id === "number" ? kategoria_id : Number(kategoria_id);
    let category = this.categories?.find(cat => cat.kategoria_id === id);
    return category ? category.nazwa : "???";
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

}

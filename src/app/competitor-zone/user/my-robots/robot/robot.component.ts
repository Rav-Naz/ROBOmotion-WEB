import { TranslateService } from '@ngx-translate/core';
import { UiService } from './../../../../services/ui.service';
import { UserService } from './../../../../services/user.service';
import { Constructor } from './../../../../models/constructor';
import { CategoriesService } from './../../../../services/categories.service';
import { RobotsService } from './../../../../services/robots.service';
import { AuthService } from './../../../../services/auth.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Robot } from 'src/app/models/robot';
import { CategoryMain } from 'src/app/models/category-main';
import { ConstructorsService } from 'src/app/services/constructors.service';
import { AlreadyExist } from 'src/app/shared/utils/exist';


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
  private loadingName: boolean = true;
  private loadingCategories: boolean = true;
  private loadingConstructors: boolean = true;
  private subs: Subscription = new Subscription;
  public robot: Robot | null = null;
  public categories: Array<CategoryMain> | null = null;
  public robots: Array<Robot> | null = null;
  public constructors: Array<Constructor> | null = null;
  public aviableCategories: Array<CategoryMain> | null = null;
  private lastConstructorMessage: object | null = null;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, public authService: AuthService, private robotsService: RobotsService,
    private categoriesService: CategoriesService, private constructorsService: ConstructorsService, private userSerceice: UserService, private router: Router,
    private ui: UiService, private translate: TranslateService) {
    const robot_uuid = this.route.snapshot.paramMap.get('robot_uuid');
    const sub1 = combineLatest(this.categoriesService.categories$, this.robotsService.userRobots$, this.constructorsService.getNewConstructors$).subscribe(async (val) => {

      if (val[0] !== null && val[1] !== null) {
        const categories = JSON.stringify(val[0]!);
        const robots = JSON.stringify(val[1]!);
        if (categories !== JSON.stringify(this.categories) || JSON.stringify(this.robots) !== robots) {
          this.loadingCategories = true;
          this.loadingName = true;
          this.categories = JSON.parse(categories);
          this.robots = JSON.parse(robots) as Array<Robot>;
          const thisRobot = this.robots.find((rob: any) => rob.robot_uuid == robot_uuid);
          if (thisRobot === undefined || thisRobot === null) {
            this.backToMyRobots();
            return;
          }
          this.robot = thisRobot ? thisRobot : null;
          this.oldName = this.robot!.nazwa_robota;
          this.filterAvaibleCategories();
          if (this.formCategory) {
            this.formCategory.reset();
          }
          this.formName = this.formBuilder.group({
            robot_name: [this.oldName, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]]
          });
          if (this.formName && !this.authService.canModify) {
            this.formName.disable();
          } else {
            this.formName.enable();
          }
          setTimeout(() => {
            this.loadingName = false;
            this.loadingCategories = false;
          }, 100);
          this.formConstructor = this.formBuilder.group({
            constructor_uuid: [null, [Validators.required, Validators.minLength(36), Validators.maxLength(36)]]
          });
        }
        if (val[2] !== this.lastConstructorMessage) {
          const newData = val[2] as any;
          if (this.robot !== null && this.constructors === null) {
            this.lastConstructorMessage = newData;
            await this.getConstructors();
          } else if (newData.data !== null && newData.data.robot_uuid === robot_uuid) {
            if (newData.method === 'add') {
              this.loadingConstructors = true;
              await this.getConstructors();
            } else if (newData.method === 'delete') {
              const deletedConstructor = this.constructors?.find(constr => constr.konstruktor_id === newData.data.konstruktor_id);
              const path = `/competitor-zone/(outlet:robot/${newData.data.robot_uuid})`;
              if (deletedConstructor && deletedConstructor.uzytkownik_uuid === this.userUUID && this.router.url === path) {
                this.backToMyRobots();
                this.robotsService.getAllRobotsOfUser();
              } else {
                this.loadingConstructors = true;
                await this.getConstructors();
              }
            }
          }
        }
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
      this.loadingName = true;
      this.robotsService.updateRobot(this.robot!.robot_uuid, this.formName.get('robot_name')?.value).catch(err => {
        this.backToMyRobots();
      }).then(() => {
        this.ui.showFeedback("succes", this.translate.instant('competitor-zone.robot.update-name'), 2)
      }).finally(() => {
        this.loadingName = false;
      });
    }
  }

  onAddCategory() {
    if (this.isFormGroupCategoryValid) {
      this.loadingCategories = true;
      this.categoriesService.addRobotCategory(this.formCategory.get('category')?.value, this.robot!.robot_uuid).catch(err => {
        this.backToMyRobots();
      }).then(() => {
        this.ui.showFeedback("succes", this.translate.instant('competitor-zone.robot.add-category'), 2)
      }).finally(() => {
        setTimeout(() => {
          this.loadingCategories = false;
        }, 1000);
      });
    }
  }

  async onRemoveCategory(kategoria_id: number) {
    const decision = await this.ui.wantToContinue(this.translate.instant('competitor-zone.robot.want-to-delete-category'));
    if (decision) {
      this.loadingCategories = true;
      this.categoriesService.deleteRobotCategory(kategoria_id, this.robot!.robot_uuid).then(() => {
        this.ui.showFeedback("succes", this.translate.instant('competitor-zone.robot.delete-category'), 2)
      }).finally(() => {
        setTimeout(() => {
          this.loadingCategories = false;
        }, 1000);
      });
    }
  }

  onAddConstructor() {
    if (this.isFormGroupConstructorValid) {
      this.loadingConstructors = true;
      this.constructorsService.addConstructor(this.formConstructor.get('constructor_uuid')?.value, this.robot!.robot_uuid).catch(err => {
        this.backToMyRobots();
      }).then(() => {
        this.ui.showFeedback("succes", this.translate.instant('competitor-zone.robot.add-constructor'), 2);
      }).finally(() => {
        if (this.formConstructor) this.formConstructor.reset();
      });
    }
  }

  async onDeleteConstructor(konstruktor_id: number) {
    if (this.canDeleteConstructor) {
      const decision = await this.ui.wantToContinue(this.translate.instant('competitor-zone.robot.want-to-delete-constructor'));
      if (decision) {
        this.loadingConstructors = true;
        this.constructorsService.deleteConstructor(konstruktor_id, this.robot!.robot_uuid).catch(err => {
          this.backToMyRobots();
        }).then(() => {
          this.ui.showFeedback("succes", this.translate.instant('competitor-zone.robot.delete-constructor'), 2);
        });
      }
    }
  }

  async getConstructors() {
    await this.constructorsService.getConstructorsOfRobot(this.robot!.robot_uuid).catch(err => {
      this.backToMyRobots();
    }).then(constructors => {
      this.constructors = constructors as Array<Constructor>;
      this.formConstructor = this.formBuilder.group({
        constructor_uuid: [null, [Validators.required, Validators.minLength(36), Validators.maxLength(36)]]
      }, {
        validator: AlreadyExist('constructor_uuid', this.constructors)
      });
      this.loadingConstructors = false;
    });
  }

  async onDeleteRobot() {
    const decision = await this.ui.wantToContinue(this.translate.instant('competitor-zone.robot.want-to-delete-robot'));
    if (decision) {
      this.loadingConstructors = true;
      this.loadingCategories = true;
      this.loadingName = true;
      this.robotsService.deleteRobot(this.robot!.robot_uuid).catch(err => {
        this.backToMyRobots();
      }).finally(() => {
        this.backToMyRobots();
      })
    }
  }

  backToMyRobots() {
    this.router.navigateByUrl(`/competitor-zone/(outlet:my-robots)`);
  }


  filterAvaibleCategories() {
    if (this.categories && this.robot) {
      let cats = [...this.categories];
      const kategorie_lf = [4, 5, 6, 7, 8];
      const kategorie_sumo = [12, 13, 14, 15, 16];
      const akt_lf = this.robotCategories?.filter(el => kategorie_lf.findIndex(lf => lf === el) >= 0);
      const akt_sumo = this.robotCategories?.filter(el => kategorie_sumo.findIndex(sumo => sumo === el) >= 0);
      if (akt_lf && akt_lf.length >= 2) {
        cats = cats.filter(element => kategorie_lf.findIndex(rC => rC === element.kategoria_id)! < 0);
      }
      if (akt_sumo && akt_sumo.length >= 2) {
        cats = cats.filter(element => kategorie_sumo.findIndex(rC => rC === element.kategoria_id)! < 0);
      }
      this.aviableCategories = cats.filter(element => this.robotCategories?.findIndex(rC => rC === element.kategoria_id)! < 0);
    }
  }

  public get isChanged() {
    return this.formName.get('robot_name')?.value !== this.oldName;
  }
  public get isFormGroupNameValid() {
    return this.formName.valid && !this.isLoadingName && this.authService.canModify;
  }
  public get isFormGroupCategoryValid() {
    return this.formCategory.valid && !this.isLoadingCategories && this.authService.canModify && this.canAddCategory;
  }
  public get isFormGroupConstructorValid() {
    return this.formConstructor.valid && !this.isLoadingConstructors && this.authService.canModify;
  }

  public get isLoadingName() {
    return this.loadingName;
  }
  public get isLoadingCategories() {
    return this.loadingCategories;
  }
  public get isLoadingConstructors() {
    return this.loadingConstructors;
  }

  public get userUUID() {
    return (this.userSerceice.userDetails as any).uzytkownik_uuid;
  }

  public get canDeleteConstructor() {
    return this.constructors ? (this.constructors.length > 1) : false;
  }

  public get nameFormEmpty() {
    return this.formConstructor.untouched;
  }

  public get categoriesOptions(): string | undefined {
    if (this.aviableCategories) {
      return JSON.stringify(this.aviableCategories.map((category: CategoryMain) => {
        return { value: category.nazwa, id: category.kategoria_id };
      }));
    }
    else {
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

  public get canDeleteCategory() {
    return this.robotCategories ? this.robotCategories?.length > 1 : false;
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

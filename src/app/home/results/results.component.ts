import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryMain } from 'src/app/models/category-main';
import { Subscription, combineLatest } from 'rxjs';
import { PositionsService } from 'src/app/services/positions.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { TimesService } from 'src/app/services/times.service';
import { UiService } from 'src/app/services/ui.service';
import { FightsService } from 'src/app/services/fights.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { onlyUnique } from 'src/app/shared/utils/unique';
import { Position } from './../../models/position';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})


export class ResultsComponent implements OnInit, OnDestroy {

  public formOption: FormGroup;
  public formFilter: FormGroup;
  public positions: Array<Position> | null = null;
  public categories: Array<CategoryMain> | null = null;
  public allFights: Array<any> | null = null;
  public allTimes: Array<any> | null = null;
  public filterOptions: string = JSON.stringify([
    { value: "Stanowisko", id: 1 },
    { value: "Robot UUID", id: 2 },
    { value: "Robot nazwa", id: 3 }
  ]);

  private loading: boolean = false;
  private subs: Subscription = new Subscription;
  public selectedPosition: number | null = null;
  public selectedCategory: number | null = null;
  public selectedGroup: number | null = null;
  public isLoading: boolean = false;
  private selectedFilter: number | null = 1;
  private filter: string = '';

  constructor(private positionsService: PositionsService, private formBuilder: FormBuilder,
     private categoriesService: CategoriesService, public translateService: TranslateService, private timesService: TimesService,
      private ui: UiService, private figthsService: FightsService, private route: ActivatedRoute, private router: Router, public userService: UserService) {

    this.formOption = this.formBuilder.group({
      filter: [this.selectedFilter]
    });
    this.formFilter = this.formBuilder.group({
      filter_name: [this.filter]
    });
    positionsService.getAllPositions();
    timesService.getAllTimes();
    figthsService.getAllFights();
    const sub1 = combineLatest(this.categoriesService.categories$,this.positionsService.allPositions$, this.figthsService.allFights$,this.timesService.allTimes$).subscribe((val) => {
      console.log(val);
      if (val[0] && val[1] && val[2] && val[3]) {
        this.categories = JSON.parse(JSON.stringify(val[0]));
        this.positions = JSON.parse(JSON.stringify(val[1]));
        this.allFights = JSON.parse(JSON.stringify(val[2]));
        this.allTimes = JSON.parse(JSON.stringify(val[3]));
        this.loading = false;
      }
    })

    this.subs.add(sub1);
  }

  ngOnInit(): void {

  }

  selectCategory(kategoria_id: number) {
    this.selectedCategory = Number(kategoria_id);
    this.selectedGroup = null;
  }

  selectGroup(grupa_id: number) {
    this.selectedGroup = Number(grupa_id);
  }


  get getFightGroupsFromCategory() {
    const groups = [...(this.getCategoryFigths ? this.getCategoryFigths : [])].map(el => {
      return el.grupa_id
    }).filter(onlyUnique).map(el => {
      const temp = this.allFights?.find(fight => fight.grupa_id === el);
      return {grupa_id: el, nazwa_grupy: temp.nazwa_grupy}
    });
    return groups;
  }

  get positionsOptions(): string | undefined {
    return this.positions ? JSON.stringify(Object.assign(this.positions).map((position: Position) => {
      return {value: position.nazwa, id: position.stanowisko_id}
    })) : undefined;
  }

  get categoriesInPosition() {
    const categories = this.positions?.find(el => el.stanowisko_id === this.selectedPosition)?.kategorie;
    if(categories) {
      const a = [...[...categories.split(", ")].map((cat) => {
        const obj = this.categories!.find(obj => obj.kategoria_id.toString() === cat);
        return {kategoria_id: obj?.kategoria_id, nazwa: obj?.nazwa};
      })];
      return a;
    } else {
      return undefined;
    }
  }

  // get competitorsFiltered() {
  //   let wyniki = this.all ? [...this.allCompetitors] : undefined;
  //   if (this.filter !== '' && userzy) {
  //     switch (this.selectedFilter) {
  //       case 1:
  //         userzy = userzy.filter(user => String(user.imie + ' ' + user.nazwisko).toLowerCase().includes(this.filter));
  //         break;
  //       case 2:
  //         userzy = userzy.filter(user => String(user.uzytkownik_uuid).toLowerCase().includes(this.filter));
  //           break;
  //       case 3:
  //         userzy = userzy.filter(user => String(user.stanowiska).toLowerCase().includes(this.filter));
  //         break;
  //       case 4:
  //         userzy = userzy.filter(user => String(user.roboty_uuid).toLowerCase().includes(this.filter));
  //         break;
  //       case 5:
  //         userzy = userzy.filter(user => String(user.numer_telefonu).toLowerCase().includes(this.filter));
  //         break;
  //       case 6:
  //         userzy = userzy.filter(user => String(user.email).toLowerCase().includes(this.filter));
  //         break;
  //       case 7:
  //         userzy = userzy.filter(user => String(user.kategorie).toLowerCase().includes(this.filter));
  //         break;
      
  //       default:
  //         break;
  //     }
  //   }
  //   return userzy;
  // }

  get getCategoryType() {
    return this.categories?.find(el => el.kategoria_id === this.selectedCategory)?.rodzaj
  }

  get getCategoryFigths() {
    return this.allFights?.filter(el => el.kategoria_id === this.selectedCategory).sort((a,b) => b.walka_id - a.walka_id).sort((a,b) => a.czas_zakonczenia - b.czas_zakonczenia);
  }

  get getGroupFigths() {
    return this.allFights?.filter(el => el.kategoria_id === this.selectedCategory && el.grupa_id === this.selectedGroup).sort((a,b) => b.walka_id - a.walka_id).sort((a,b) => a.czas_zakonczenia - b.czas_zakonczenia);
  }

  get getCategoryTimesResult() {
    return this.allTimes?.filter(el => el.kategoria_id === this.selectedCategory).sort((a,b) => b.wynik_id - a.wynik_id);
  }

  formatDate(date: string) {
    const now = new Date(date);
    return now.toISOString();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}

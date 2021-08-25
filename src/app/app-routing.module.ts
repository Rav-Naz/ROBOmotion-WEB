import { ConfirmCodeComponent } from './competitor-zone/confirm-code/confirm-code.component';
import { BuildingPlanComponent } from './home/building-plan/building-plan.component';
import { TimetableComponent } from './home/timetable/timetable.component';
import { ResultsComponent } from './home/results/results.component';
import { CompetitorZoneComponent } from './competitor-zone/competitor-zone.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'results', component: ResultsComponent},
  {path: 'timetable', component: TimetableComponent},
  {path: 'building-plan', component: BuildingPlanComponent},
  {path: 'competitor-zone', component: CompetitorZoneComponent},
  {path: 'confirm-code/:uzytkownik_uuid/:kod/:czy_na_telefon', component: ConfirmCodeComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

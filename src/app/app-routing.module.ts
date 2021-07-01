import { TimetableComponent } from './home/timetable/timetable.component';
import { ResultsComponent } from './home/results/results.component';
import { CompetitorZoneComponent } from './competitor-zone/competitor-zone.component';
import { AdminZoneComponent } from './admin-zone/admin-zone.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'results', component: ResultsComponent},
  {path: 'timetable', component: TimetableComponent},
  {path: 'admin', component: AdminZoneComponent},
  {path: 'competitor-zone', component: CompetitorZoneComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

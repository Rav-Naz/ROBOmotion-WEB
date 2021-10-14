import { AddTimeResultComponent } from './competitor-zone/referee/add-time-result/add-time-result.component';
import { AppRulesComponent } from './competitor-zone/app-rules/app-rules.component';
import { ResetPasswordComponent } from './competitor-zone/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './competitor-zone/forgot-password/forgot-password.component';
import { RobotComponent } from './competitor-zone/user/my-robots/robot/robot.component';
import { NewRobotComponent } from './competitor-zone/user/my-robots/new-robot/new-robot.component';
import { RefereeZoneComponent } from './competitor-zone/referee/referee-zone/referee-zone.component';
import { SettingsComponent } from './competitor-zone/user/settings/settings.component';
import { MyRobotsComponent } from './competitor-zone/user/my-robots/my-robots.component';
import { AuthGuard } from './services/auth-guard.service';
import { RegisterComponent } from './competitor-zone/register/register.component';
import { LoginComponent } from './competitor-zone/login/login.component';
import { ConfirmCodeComponent } from './competitor-zone/confirm-code/confirm-code.component';
import { BuildingPlanComponent } from './home/building-plan/building-plan.component';
import { TimetableComponent } from './home/timetable/timetable.component';
import { ResultsComponent } from './home/results/results.component';
import { CompetitorZoneComponent } from './competitor-zone/competitor-zone.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefereeGuard } from './services/referee-guard.service';

const routes: Routes = [
  {path: '', component: HomeComponent},
  // {path: 'results', component: ResultsComponent},
  // {path: 'timetable', component: TimetableComponent},
  // {path: 'building-plan', component: BuildingPlanComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'app-rules', component: AppRulesComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password/:uzytkownik_uuid/:kod', component: ResetPasswordComponent},
  {path: 'competitor-zone', canActivate: [AuthGuard], component: CompetitorZoneComponent, children: [
    {path: 'my-robots', component: MyRobotsComponent, outlet: 'outlet'},
    {path: 'settings', component: SettingsComponent, outlet: 'outlet'},
    {path: 'robot/:robot_uuid', component: RobotComponent, outlet: 'outlet'},
    {path: 'add-robot', component: NewRobotComponent,  outlet: 'outlet'},

    // {path: 'referee-zone', component: RefereeZoneComponent, canActivate: [RefereeGuard], outlet: 'outlet'},
    // {path: 'add-time-result', component: AddTimeResultComponent, canActivate: [RefereeGuard], outlet: 'outlet'},
  ]},
  {path: 'confirm-code/:uzytkownik_uuid/:kod/:czy_na_telefon', component: ConfirmCodeComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

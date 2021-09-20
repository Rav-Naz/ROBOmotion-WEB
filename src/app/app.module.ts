import { ConfirmComponent } from './shared/confirm/confirm.component';
import { RobotsService } from './services/robots.service';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CompetitorZoneComponent } from './competitor-zone/competitor-zone.component';
import { TimetableComponent } from './home/timetable/timetable.component';
import { ResultsComponent } from './home/results/results.component';
import { MsToDaysPipe } from './pipes/ms-transform.pipe';
import { BuildingPlanComponent } from './home/building-plan/building-plan.component';
import { HeaderComponent } from './shared/header/header.component';
import { ConfirmCodeComponent } from './competitor-zone/confirm-code/confirm-code.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { InputComponent } from './shared/input/input.component';
import { SelectComponent } from './shared/select/select.component';
import { LoginComponent } from './competitor-zone/login/login.component';
import { RegisterComponent } from './competitor-zone/register/register.component';
import { AuthGuard } from './services/auth-guard.service';
import { MyRobotsComponent } from './competitor-zone/user/my-robots/my-robots.component';
import { SettingsComponent } from './competitor-zone/user/settings/settings.component';
import { RefereeGuard } from './services/referee-guard.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NewRobotComponent } from './competitor-zone/user/my-robots/new-robot/new-robot.component';
import { RobotComponent } from './competitor-zone/user/my-robots/robot/robot.component';
import { WebsocketService } from './services/websocket.service';
import { ConstructorsService } from './services/constructors.service';
import { ForgotPasswordComponent } from './competitor-zone/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './competitor-zone/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompetitorZoneComponent,
    TimetableComponent,
    ResultsComponent,
    MsToDaysPipe,
    BuildingPlanComponent,
    ConfirmComponent,
    HeaderComponent,
    ConfirmCodeComponent,
    SpinnerComponent,
    InputComponent,
    SelectComponent,
    LoginComponent,
    RegisterComponent,
    MyRobotsComponent,
    SettingsComponent,
    NewRobotComponent,
    RobotComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      maxOpened: 3,
      enableHtml: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pl-PL" },
    AuthGuard,
    RefereeGuard,
    WebsocketService,
    RobotsService,
    ConstructorsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CompetitorZoneComponent } from './competitor-zone/competitor-zone.component';
import { AdminZoneComponent } from './admin-zone/admin-zone.component';
import { TimetableComponent } from './home/timetable/timetable.component';
import { ResultsComponent } from './home/results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompetitorZoneComponent,
    AdminZoneComponent,
    TimetableComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

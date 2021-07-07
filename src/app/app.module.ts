import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CompetitorZoneComponent } from './competitor-zone/competitor-zone.component';
import { AdminZoneComponent } from './admin-zone/admin-zone.component';
import { TimetableComponent } from './home/timetable/timetable.component';
import { ResultsComponent } from './home/results/results.component';
import { MsToDaysPipe } from './pipes/ms-transform.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompetitorZoneComponent,
    AdminZoneComponent,
    TimetableComponent,
    ResultsComponent,
    MsToDaysPipe  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

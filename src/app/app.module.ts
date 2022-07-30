import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NivelEscolarDatatableComponent } from './nivelescolar/nivel-escolar-datatable/nivel-escolar-datatable.component';
import { NivelEscolarFormComponent } from './nivelescolar/nivel-escolar-form/nivel-escolar-form.component';
import { MaterialModule } from './material.module';

import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
registerLocaleData(localePT);

@NgModule({
  declarations: [
    AppComponent,
    NivelEscolarDatatableComponent,
    NivelEscolarFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

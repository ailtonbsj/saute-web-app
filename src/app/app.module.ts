import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
registerLocaleData(localePT);

import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './security/auth.interceptor';
import { LoginComponent } from './security/login/login.component';
import { AuthService } from './security/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component } from '@angular/core';
import { delay, EMPTY, Subscription } from 'rxjs';
import { AuthService } from './security/auth.service';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrls: ['./app.css'],
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MaterialModule]
})
export class App {
  title = 'saute-web';
  isAuth$ = AuthService.authAsObservable();
  hasApi$ = AuthService.apiAsObservable();

  constructor(private auth: AuthService) {
    AuthService.emitAuth();
  }

  doLogout() {
    this.auth.logout();
  }

  about() {
    window.alert('Esse projeto é um estudo de caso baseado no projeto SAUTE do Mario Rocha feito anteriormente em Lazarus (Free Delphi).\nEssa versão roda totalmente no browser usando o banco de dados embutido IndexedDB.');
  }
}

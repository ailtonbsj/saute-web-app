import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HelperService } from '../shared/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static authSubject = new BehaviorSubject<boolean>(false);
  private static apiSubject = new BehaviorSubject<boolean>(
    (localStorage.getItem('api') || 'local') == 'local' ? false : true
  );

  public api = localStorage.getItem('api') || 'local';

  constructor(
    private http: HttpClient,
    private helper: HelperService,
    private router: Router
  ) { }

  loginWithGoogle(token: string) {
    this.http.post(`${this.api}/users/with-google`, token).subscribe({
      next: (v: any) => {
        localStorage.setItem('credentials', JSON.stringify(v));
        const data = (<string>v.token).split('.')[1];
        const info = JSON.parse(window.atob(data));
        // JSON.stringify(v.roles.map((role: any) => role.name))
        localStorage.setItem('roles', info.roles);
        AuthService.authSubject.next(true);
        console.log(localStorage.getItem('roles'));
        this.router.navigate(['/processo']);
      },
      error: (e) => {
        console.log(e);
        this.helper.alertSnack("Credenciais inválidas!");
        AuthService.authSubject.next(false);
      }
    });
  }

  login(username: string, password: string) {
    const credentials = { username, password };
    this.http.post(`${this.api}/login`, credentials).subscribe({
      next: (v: any) => {
        localStorage.setItem('credentials', JSON.stringify(v));
        const data = (<string>v.token).split('.')[1];
        const info = JSON.parse(window.atob(data));
        // JSON.stringify(v.roles.map((role: any) => role.name))
        localStorage.setItem('roles', info.roles);
        AuthService.authSubject.next(true);
        this.router.navigate(['/processo']);
      },
      error: (e) => {
        console.log(e);
        this.helper.alertSnack("Credenciais inválidas!");
        AuthService.authSubject.next(false);
      }
    });
  }

  logout() {
    localStorage.removeItem('credentials');
    AuthService.authSubject.next(false);
    this.router.navigate(['/']);
  }

  getAuthorizationToken(): string {
    return this.basicAuth();
  }

  private basicAuth(): string {
    if (localStorage.getItem('credentials')) {
      const credentials: any = JSON.parse(<string>localStorage.getItem('credentials')).token;
      return `Bearer ${credentials}`;
    } else return '';
  }

  static emitAuth(): void {
    let val = false;
    const api = localStorage.getItem('api') || 'local';
    if (api !== 'local') { // enabled
      val = localStorage.getItem('credentials') ? true : false;
    } else val = true;
    AuthService.authSubject.next(val);
  }

  static authAsObservable(): Observable<boolean> {
    return AuthService.authSubject.asObservable();
  }

  static emitApi(): void {
    const val = (localStorage.getItem('api') || 'local') == 'local' ? false : true;
    AuthService.apiSubject.next(val);
  }

  static apiAsObservable(): Observable<boolean> {
    return AuthService.apiSubject.asObservable();
  }

}

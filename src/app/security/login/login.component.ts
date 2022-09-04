import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  iconEye = 'visibility_off';

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    AuthService.authAsObservable().subscribe(b => {
      if (b) this.router.navigate(['processo']);
    });
  }

  doLogin() {
    this.auth.login(this.username, this.password);
  }

  doLogout() {
    this.auth.logout();
  }

}

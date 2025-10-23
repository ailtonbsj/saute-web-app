import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

declare let google: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  iconEye = 'visibility_off';

  constructor(private auth: AuthService, private router: Router, private zone: NgZone) { }

  ngOnInit(): void {
    AuthService.authAsObservable().subscribe(b => {
      if (b) this.router.navigate(['processo']);
    });
    
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: (v: any) => {
        this.zone.run(() => this.doLoginWithGoogle(v));
      }
    });
    google.accounts.id.renderButton(
      document.getElementById("btn-google"),
      { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  doLogin() {
    this.auth.login(this.username, this.password);
  }

  doLogout() {
    this.auth.logout();
  }

  doLoginWithGoogle(data: any) {    
    this.auth.loginWithGoogle(<string> data.credential);
  }

}

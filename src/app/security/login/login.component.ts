import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

declare let google: any;

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

    google.accounts.id.initialize({
      client_id: "CLIENT_ID",
      callback: this.doLoginWithGoogle
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
    console.log(data);
  }

}

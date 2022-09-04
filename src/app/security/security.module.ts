import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    FormsModule,
    MaterialModule
  ],
  providers: [
    AuthService
  ]
})
export class SecurityModule { }

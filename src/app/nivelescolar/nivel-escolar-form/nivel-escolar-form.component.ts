import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-nivel-escolar-form',
  templateUrl: './nivel-escolar-form.component.html',
  styleUrls: ['./nivel-escolar-form.component.css']
})
export class NivelEscolarFormComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor() { }

  ngOnInit(): void {
  }

}

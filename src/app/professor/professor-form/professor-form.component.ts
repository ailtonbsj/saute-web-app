import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { BrazilCity, BrazilState } from 'src/app/shared/brazil-info';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { FormMode } from 'src/app/shared/form-mode';
import { HelperService } from 'src/app/shared/helper.service';
import { Professor } from '../professor.model';

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.css']
})
export class ProfessorFormComponent implements OnInit {

  formMode: FormMode = FormMode.INSERT;
  entity: Professor = <Professor>{};

  displayAuto = HelperService.displayAuto;
  ufs$: Observable<BrazilState[]> = EMPTY;
  municipios$: Observable<BrazilCity[]> = EMPTY;

  form = this.fb.group({
    nome: ['', Validators.required],
    nascimento: ['', Validators.required],
    naturalidade: ['', Validators.required],
    cpf: ['', Validators.required],
    rg: ['', Validators.required],
    orgaoEmissor: ['', Validators.required],
    endereco: this.fb.group({
      cep: [''],
      rua: ['', Validators.required],
      numero: [''],
      bairro: ['', Validators.required],
      municipio: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
      uf: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
    }),
    // nivelEscolar: ['', [Validators.required, CustomValidators.autocompleteValidator()]],

    // email: ['', [Validators.required, Validators.email]],
    // dependencia: ['', Validators.required],
    // entidade: ['', Validators.required],
    // credenciamento: ['', Validators.required],
    // valorCredenciamento: ['', Validators.required],
    // recredenciamento: ['', Validators.required],
    // valorRecredenciamento: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() { }

  navigateToTable() { }

}

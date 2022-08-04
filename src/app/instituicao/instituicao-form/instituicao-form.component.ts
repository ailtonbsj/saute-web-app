import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { EMPTY, map, Observable, startWith, tap } from 'rxjs';
import { NivelEscolar } from 'src/app/nivel-escolar/nivel-escolar.model';
import { NivelEscolarService } from 'src/app/nivel-escolar/nivel-escolar.service';
import { FormMode } from 'src/app/shared/form-mode';
import { Instituicao } from '../instituicao.model';

@Component({
  selector: 'app-instituicao-form',
  templateUrl: './instituicao-form.component.html',
  styleUrls: ['./instituicao-form.component.css']
})
export class InstituicaoFormComponent implements OnInit {

  formMode: FormMode = FormMode.INSERT;
  entity: Instituicao = <Instituicao>{};
  nivelEscolar: NivelEscolar[] = [];
  nivelEscolar$: Observable<any> = EMPTY;

  form = new FormGroup({
    instituicao: new FormControl('', [Validators.required]),
    nivelEscolar: new FormControl('', [this.autocompleteObjectValidator(), Validators.required]),
    endereco: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required]),
    bairro: new FormControl('', [Validators.required]),
    municipio: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dependencia: new FormControl('', [Validators.required]),
    entidade: new FormControl('', [Validators.required]),
    credenciamento: new FormControl('', [Validators.required]),
    valorCredenciamento: new FormControl('', [Validators.required]),
    recredenciamento: new FormControl('', [Validators.required]),
    valorRecredenciamento: new FormControl('', [Validators.required]),
  })

  constructor(private nivelEscolarService: NivelEscolarService) { }

  ngOnInit(): void {
    this.nivelEscolarService.index().subscribe({
      next: data => {
        this.nivelEscolar = data;
        this.nivelEscolar$ = this.form.get('nivelEscolar')!.valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            const name = typeof value === 'string' ? value : value.nivelEscolar;
            return name ? this._filter(name as string) : this.nivelEscolar.slice();
          })
        );
      }
    });
  }

  private _filter(name: string): NivelEscolar[] {
    const filterValue = name.toLowerCase();

    return this.nivelEscolar.filter(option => option.nivelEscolar.toLowerCase().includes(filterValue));
  }

  displayFn(user: NivelEscolar): string {
    return user && user.nivelEscolar ? user.nivelEscolar : '';
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  onSubmit() {
    console.log(this.form);

  }

  navigateToTable() { }

}

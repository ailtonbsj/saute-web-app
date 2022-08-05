import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { EMPTY, merge, filter, map, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
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

  nivelEscolarIsBusy = false;
  nivelEscolar$: Observable<NivelEscolar[]> = EMPTY;

  form = new FormGroup({
    instituicao: new FormControl('', [Validators.required]),
    nivelEscolar: new FormControl('', [Validators.required, this.autocompleteValidator()]),
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
    const autoComplete = new Subject<NivelEscolar[]>();
    const autoComplete$ = autoComplete.asObservable();
    this.nivelEscolar$ = merge(autoComplete$, this.form.controls.nivelEscolar.valueChanges.pipe(
      filter((value: any) => !value.nivelEscolar),
      filter(() => !this.nivelEscolarIsBusy),
      tap(() => this.nivelEscolarIsBusy = true),
      switchMap(val => this.nivelEscolarService.filter(val)),
      tap(() => this.nivelEscolarIsBusy = false)
    ));
    // this.nivelEscolar$ = merge(
    //   autoComplete$, this.form.controls.nivelEscolar.valueChanges.pipe(
    //     tap(val => console.log('val', val.nivelEscolar)),
    //     filter(val => !this.nivelEscolarIsBusy),
    //     switchMap(val => {
    //       this.nivelEscolarIsBusy = true;
    //       return this.nivelEscolarService.filter(val || '');
    //     }),
    //     tap(val => this.nivelEscolarIsBusy = false)
    //   ));
    this.nivelEscolarService.filter('').subscribe(arr => autoComplete.next(arr));
  }

  displayFn(data: NivelEscolar): string {
    return data && data.nivelEscolar ? data.nivelEscolar : '';
  }

  autocompleteValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocomplete': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  onSubmit() {
    console.log(this.entity);
    if (this.form.valid) {
      // this.entity = <NivelEscolar>{
      //   ...this.entity,
      //   ...this.form.value
      // };
      // if (this.formMode === FormMode.INSERT) {
      //   this.service.store(this.entity).subscribe({
      //     next: _ => {
      //       this.snack.alertSnack('Inserido com sucesso.');
      //       this.navigateToTable();
      //     }
      //   });
      // } else {
      //   this.service.update(this.entity).subscribe({
      //     next: _ => {
      //       this.snack.alertSnack('Atualizado com sucesso.');
      //       this.navigateToTable();
      //     }
      //   });
      // }
    } else this.form.markAllAsTouched();

  }

  navigateToTable() { }

}

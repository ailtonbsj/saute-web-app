import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, merge, filter, Observable, Subject, switchMap, tap, of } from 'rxjs';
import { NivelEscolar } from 'src/app/nivel-escolar/nivel-escolar.model';
import { NivelEscolarService } from 'src/app/nivel-escolar/nivel-escolar.service';
import { BrazilCity, BrazilState } from 'src/app/shared/brazil-info';
import { BrazilInfoService } from 'src/app/shared/brazil-info.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { FormMode } from 'src/app/shared/form-mode';
import { HelperService } from 'src/app/shared/helper.service';
import { Instituicao } from '../instituicao.model';
import { InstituicaoService } from '../instituicao.service';

@Component({
  selector: 'app-instituicao-form',
  templateUrl: './instituicao-form.component.html',
  styleUrls: ['./instituicao-form.component.css']
})
export class InstituicaoFormComponent implements OnInit {

  formMode: FormMode = FormMode.INSERT;
  entity: Instituicao = <Instituicao>{};

  displayAuto = HelperService.displayAuto;
  nivelEscolarIsBusy = false;
  nivelEscolar$: Observable<NivelEscolar[]> = EMPTY;
  ufs$: Observable<BrazilState[]> = EMPTY;
  municipios$: Observable<BrazilCity[]> = EMPTY;

  form = this.fb.group({
    instituicao: ['', Validators.required],
    nivelEscolar: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
    endereco: this.fb.group({
      cep: [''],
      rua: ['', Validators.required],
      numero: [''],
      bairro: ['', Validators.required],
      municipio: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
      uf: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
    }),
    email: ['', [Validators.required, Validators.email]],
    dependencia: ['', Validators.required],
    entidade: ['', Validators.required],
    credenciamento: ['', Validators.required],
    valorCredenciamento: ['', Validators.required],
    recredenciamento: ['', Validators.required],
    valorRecredenciamento: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private nivelEscolarService: NivelEscolarService,
    private instituicaoService: InstituicaoService,
    private helper: HelperService,
    private router: Router,
    private brInfo: BrazilInfoService) { }

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
    this.nivelEscolarService.filter('').subscribe(arr => autoComplete.next(arr));

    this.ufs$ = this.brInfo.getStates();

    this.municipios$ = this.form.controls.endereco.controls.municipio.valueChanges.pipe(
      filter((value: any) => !value.nome),
      switchMap(val => {
        const municipio = <BrazilCity | null>this.form.controls.endereco.controls.uf.value;
        const municipioId = municipio ? '' + municipio.id : undefined;
        return this.brInfo.filterCities(val, municipioId);
      }),
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.entity = <Instituicao>{
        ...this.entity,
        ...this.form.value,
      };
      this.entity.nivelEscolarId = this.entity.nivelEscolar?.id || 0;
      if (this.formMode === FormMode.INSERT) {
        this.instituicaoService.store({ ...this.entity }).subscribe({
          next: _ => {
            this.helper.alertSnack('Inserido com sucesso.');
            this.navigateToTable();
          }
        });
      } else {
        // this.service.update(this.entity).subscribe({
        //   next: _ => {
        //     this.snack.alertSnack('Atualizado com sucesso.');
        //     this.navigateToTable();
        //   }
        // });
      }
    } else this.form.markAllAsTouched();

  }

  navigateToTable() {
    this.router.navigate(['instituicao']);
  }

}

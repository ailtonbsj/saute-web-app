import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, merge, filter, Observable, Subject, switchMap, tap, of, map } from 'rxjs';
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

  @ViewChild('autoUf') _autoUf: MatAutocomplete = <MatAutocomplete>{};
  @ViewChild('cep') _cep: ElementRef = <ElementRef>{};

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
    validadeCredenciamento: ['', [Validators.required, CustomValidators.date()]],
    recredenciamento: [''],
    validadeRecredenciamento: ['', [CustomValidators.date()]],
  });

  constructor(
    private fb: FormBuilder,
    private nivelEscolarService: NivelEscolarService,
    private instituicaoService: InstituicaoService,
    private helper: HelperService,
    private router: Router,
    private route: ActivatedRoute,
    private brInfo: BrazilInfoService
  ) { }

  ngOnInit(): void {
    this.initNivelEscolar();
    this.initCEP();
    this.ufs$ = this.brInfo.getStates(); // init UF
    this.initMunicipio();
    this.loadFormData();
  }

  private initNivelEscolar(): void {
    const autoNivelEscolar = new Subject<NivelEscolar[]>();
    const autoNivelEscolar$ = autoNivelEscolar.asObservable();
    this.nivelEscolar$ = merge(autoNivelEscolar$, this.form.controls.nivelEscolar.valueChanges.pipe(
      filter((value: any) => !value.nivelEscolar),
      filter(() => !this.nivelEscolarIsBusy),
      tap(() => this.nivelEscolarIsBusy = true),
      switchMap(val => this.nivelEscolarService.filter(val)),
      tap(() => this.nivelEscolarIsBusy = false)
    ));
    this.nivelEscolarService.filter('').subscribe(arr => autoNivelEscolar.next(arr));
  }

  private initCEP(): void {
    this.form.controls.endereco.controls.cep.valueChanges.pipe(
      map(() => (<HTMLInputElement>this._cep.nativeElement).value),
      filter(val => val.length === 8),
      switchMap(val => this.brInfo.searchByCEP('' + val)),
      filter((val: any) => val && !val.erro)
    ).subscribe(val => {
      const address = this.form.controls.endereco.controls;
      const street = address.rua;
      const district = address.bairro;
      const state = address.uf;
      const city = address.municipio;
      if (street.value === '') street.setValue(val.logradouro);
      if (district.value === '') district.setValue(val.bairro);
      if (state.value === '') state.setValue(
        this._autoUf.options.find(v => v.value.sigla === val.uf)?.value
      );
      if (city.value === '') {
        this.brInfo.getCityByName(val.localidade).subscribe(m => {
          this.form.controls.endereco.controls.municipio.setValue(<any>m)
        });
      }
    });
  }

  private initMunicipio(): void {
    this.municipios$ = this.form.controls.endereco.controls.municipio.valueChanges.pipe(
      filter((value: any) => !value.nome),
      switchMap(val => {
        const uf = <BrazilState | null>this.form.controls.endereco.controls.uf.value;
        const ufId = uf ? '' + uf.id : undefined;
        return this.brInfo.filterCities(val, ufId);
      }),
    );
  }

  private loadFormData(): void {
    if (this.route.snapshot.params['id']) {
      this.formMode = FormMode.UPDATE;
      this.instituicaoService.show(this.route.snapshot.params['id']).subscribe({
        next: entity => {
          if (entity.id) {
            this.entity = { ...entity };
            // set autocomplete's
            this.form.controls.nivelEscolar.setValue(<any>entity.nivelEscolar);
            this.form.controls.endereco.controls.uf.setValue(
              this._autoUf.options.find(v => v.value.nome === entity.endereco.uf)?.value
            );
            this.brInfo.getCityByName(entity.endereco.municipio).subscribe(m => {
              this.form.controls.endereco.controls.municipio.setValue(<any>m)
            });
            // set inputs
            const patch: any = { ...entity };
            delete patch.nivelEscolar;
            delete patch.endereco.uf;
            delete patch.endereco.municipio;
            this.form.patchValue(patch);
          } else this.navigateToTable();
        }
      });
    }
    else {
      this.formMode = FormMode.INSERT;
      this.entity = <Instituicao>{};
    }
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
        this.instituicaoService.update(this.entity).subscribe({
          next: _ => {
            this.helper.alertSnack('Atualizado com sucesso.');
            this.navigateToTable();
          }
        });
      }
    } else this.form.markAllAsTouched();
  }

  navigateToTable() {
    this.router.navigate(['instituicao']);
  }

}

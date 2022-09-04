import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, EMPTY, filter, forkJoin, map, Observable, switchMap, take, tap } from 'rxjs';
import { BrazilCity, BrazilState } from 'src/app/shared/brazil-info';
import { BrazilInfoService } from 'src/app/shared/brazil-info.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { FormMode } from 'src/app/shared/form-mode';
import { HelperService } from 'src/app/shared/helper.service';
import { Professor } from '../professor.model';
import { ProfessorService } from '../professor.service';

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.css']
})
export class ProfessorFormComponent implements OnInit {

  formMode: FormMode = FormMode.INSERT;
  entity: Professor = <Professor>{};

  displayAuto = HelperService.displayAuto;
  naturalidade$: Observable<BrazilCity[]> = EMPTY;
  ufs$: Observable<BrazilState[]> = EMPTY;
  municipios$: Observable<BrazilCity[]> = EMPTY;
  fieldsLoader$: Observable<any>[] = [];

  @ViewChild('autoUf') _autoUf: MatAutocomplete = <MatAutocomplete>{};
  @ViewChild('cep') _cep: ElementRef = <ElementRef>{};

  categoriasCNH: string[] = ['A', 'B', 'C', 'D', 'E'];
  foto: File = <File>{};

  imageBlob: string = '/assets/user.png';

  form = this.fb.group({
    nome: ['', Validators.required],
    nascimento: ['', [Validators.required, CustomValidators.date()]],
    naturalidade: ['', Validators.required],
    cpf: ['', [Validators.required, CustomValidators.number()]],
    rg: ['', [Validators.required, CustomValidators.number()]],
    orgaoEmissor: ['', Validators.required],
    endereco: this.fb.group({
      cep: ['', CustomValidators.number()],
      rua: ['', Validators.required],
      numero: ['', CustomValidators.number()],
      bairro: ['', Validators.required],
      municipio: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
      uf: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
    }),
    telefone: ['', CustomValidators.number()],
    celular: ['', [Validators.required, CustomValidators.number()]],
    email: ['', [Validators.required, Validators.email]],
    pai: [''],
    mae: [''],
    habilitacao: ['', [Validators.required]],
    categoriaCNH: [''],
  });

  constructor(
    private fb: FormBuilder,
    private brInfo: BrazilInfoService,
    private helper: HelperService,
    private professorService: ProfessorService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initCEP();
    this.naturalidade$ = this.brInfo.initCityAutocomplete(this.form.controls.naturalidade);
    this.municipios$ = this.brInfo.initCityAutocomplete(
      this.form.controls.endereco.controls.municipio,
      this.form.controls.endereco.controls.uf
    );
    this.ufs$ = this.brInfo.getStates().pipe(
      tap(() => this.loadFormData())
    );
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

  private loadFormData(): void {
    if (this.route.snapshot.params['id']) {
      this.formMode = FormMode.UPDATE;
      this.professorService.show(this.route.snapshot.params['id']).subscribe({
        next: entity => {
          if (entity.id) {
            this.entity = { ...entity };
            // set autocomplete's
            this.brInfo.getCityByName(entity.naturalidade).subscribe(m => {
              this.form.controls.naturalidade.setValue(<any>m);
            });
            this.form.controls.endereco.controls.uf.setValue(
              this._autoUf.options.find(v => v.value.nome === entity.endereco.uf)?.value
            );
            this.brInfo.getCityByName(entity.endereco.municipio).subscribe(m => {
              this.form.controls.endereco.controls.municipio.setValue(<any>m)
            });
            // set inputs
            const patch: any = {
              ...entity,
              categoriaCNH: entity.categoriaCNH?.split('')
            };
            delete patch.endereco.uf;
            delete patch.endereco.municipio;
            this.form.patchValue(patch);
            if (this.entity.foto) this.imageBlob = this.entity.foto;
          } else this.navigateToTable();
        },
      });
    }
    else {
      this.formMode = FormMode.INSERT;
      this.entity = <Professor>{};
    }
  }

  onChooseFile(ev: Event) {
    const file = (<HTMLInputElement>ev.target).files?.item(0);
    if (file) {
      this.helper.fileReader(file)
        .then(blob => this.helper.image(blob))
        .then(image => this.imageBlob = this.helper.resizePicute(image, 512));
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.entity = <Professor>{
        ...this.entity,
        ...this.form.value
      };
      this.entity.categoriaCNH = (<string[]>(this.entity.categoriaCNH || [])).join('');
      if (this.imageBlob !== '/assets/user.png') this.entity.foto = this.imageBlob;

      if (this.formMode === FormMode.INSERT) {
        this.professorService.store({ ...this.entity }).subscribe({
          next: () => {
            this.helper.alertSnack('Inserido com sucesso.');
            this.navigateToTable();
          },
          error: e => this.defaultError(e)
        });
      } else {
        this.professorService.update(this.entity).subscribe({
          next: () => {
            this.helper.alertSnack('Atualizado com sucesso.');
            this.navigateToTable();
          },
          error: e => this.defaultError(e)
        });
      }
    } else this.form.markAllAsTouched();
  }

  navigateToTable() {
    this.router.navigate(['professor']);
  }

  defaultError(e: any) {
    this.helper.alertSnack(
      e.status == 403 ? 'Sem permissão para esta operação' : 'Ocorreu um erro');
  }

}

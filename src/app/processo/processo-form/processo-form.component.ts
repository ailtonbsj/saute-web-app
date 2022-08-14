import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, filter, merge, Observable, Subject, switchMap, tap } from 'rxjs';
import { Instituicao } from 'src/app/instituicao/instituicao.model';
import { InstituicaoService } from 'src/app/instituicao/instituicao.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { FormMode } from 'src/app/shared/form-mode';
import { HelperService } from 'src/app/shared/helper.service';
import { Processo } from '../processo.model';
import { ProcessoService } from '../processo.service';

@Component({
  selector: 'app-processo-form',
  templateUrl: './processo-form.component.html',
  styleUrls: ['./processo-form.component.css']
})
export class ProcessoFormComponent implements OnInit {

  formMode: FormMode = FormMode.INSERT;
  entity: Processo = <Processo>{};

  displayAuto = HelperService.displayAuto;
  instituicaoIsBusy = false;
  instituicao$: Observable<Instituicao[]> = EMPTY;

  form = this.fb.group({
    numero: ['', [Validators.required, CustomValidators.number()]],
    instituicao: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
  });

  constructor(
    private fb: FormBuilder,
    private processoService: ProcessoService,
    private instituicaoService: InstituicaoService,
    private helper: HelperService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initInstituicao();
    this.loadFormData();
  }

  private initInstituicao(): void {
    const autoInstituicao = new Subject<Instituicao[]>();
    const autoInstituicao$ = autoInstituicao.asObservable();
    this.instituicao$ = merge(autoInstituicao$, this.form.controls.instituicao.valueChanges.pipe(
      filter((value: any) => !value.instituicao),
      filter(() => !this.instituicaoIsBusy),
      tap(() => this.instituicaoIsBusy = true),
      switchMap(val => this.instituicaoService.filter(val)),
      tap(() => this.instituicaoIsBusy = false)
    ));
    this.instituicaoService.filter('').subscribe(arr => autoInstituicao.next(arr));
  }

  private loadFormData(): void {
    if (this.route.snapshot.params['id']) {
      this.formMode = FormMode.UPDATE;
      this.processoService.show(this.route.snapshot.params['id']).subscribe({
        next: entity => {

          if (entity.id) {
            this.entity = { ...entity };
            // set autocomplete's
            this.form.controls.instituicao.setValue(<any>entity.instituicao);
            // set inputs
            const patch: any = {
              ...entity,
            };
            this.form.patchValue(patch);
          } else this.navigateToTable();

        }
      });

    }
    else {
      this.formMode = FormMode.INSERT;
      this.entity = <Processo>{};
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.entity = <Processo>{
        ...this.entity,
        ...this.form.value
      };
      this.entity.instituicaoId = this.entity.instituicao?.id || 0;

      if (this.formMode === FormMode.INSERT) {
        this.processoService.store({ ...this.entity }).subscribe({
          next: () => {
            this.helper.alertSnack('Inserido com sucesso.');
            this.navigateToTable();
          }
        });
      } else {
        this.processoService.update(this.entity).subscribe({
          next: () => {
            this.helper.alertSnack('Atualizado com sucesso.');
            this.navigateToTable();
          }
        });
      }
    } else this.form.markAllAsTouched();
  }

  navigateToTable() {
    this.router.navigate(['processo']);
  }

}

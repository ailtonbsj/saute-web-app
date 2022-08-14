import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, filter, merge, Observable, Subject, switchMap, tap } from 'rxjs';
import { Processo } from 'src/app/processo/processo.model';
import { ProcessoService } from 'src/app/processo/processo.service';
import { Professor } from 'src/app/professor/professor.model';
import { ProfessorService } from 'src/app/professor/professor.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { FormMode } from 'src/app/shared/form-mode';
import { HelperService } from 'src/app/shared/helper.service';
import { Autorizacao } from '../autorizacao.model';
import { AutorizacaoService } from '../autorizacao.service';

@Component({
  selector: 'app-autorizacao-form',
  templateUrl: './autorizacao-form.component.html',
  styleUrls: ['./autorizacao-form.component.css']
})
export class AutorizacaoFormComponent implements OnInit {

  formMode: FormMode = FormMode.INSERT;
  entity: Autorizacao = <Autorizacao>{};

  displayAuto = HelperService.displayAuto;
  professorIsBusy = false;
  professor$: Observable<Professor[]> = EMPTY;
  processoIsBusy = false;
  processo$: Observable<Processo[]> = EMPTY;

  form = this.fb.group({
    numero: ['', [Validators.required, CustomValidators.number()]],
    professor: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
    processo: ['', [Validators.required, CustomValidators.autocompleteValidator()]],
    referendum: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private autorizacaoService: AutorizacaoService,
    private professorService: ProfessorService,
    private processoService: ProcessoService,
    private helper: HelperService
  ) { }

  ngOnInit(): void {
    this.initProfessor();
    this.initProcesso();
    this.loadFormData();
  }

  private initProfessor(): void {
    const autoProfessor = new Subject<Professor[]>();
    const autoProfessor$ = autoProfessor.asObservable();
    this.professor$ = merge(autoProfessor$, this.form.controls.professor.valueChanges.pipe(
      filter((value: any) => !value.nome),
      filter(() => !this.professorIsBusy),
      tap(() => this.professorIsBusy = true),
      switchMap(val => this.professorService.filter(val)),
      tap(() => this.professorIsBusy = false)
    ));
    this.professorService.filter('').subscribe(arr => autoProfessor.next(arr));
  }

  private initProcesso(): void {
    const autoProcesso = new Subject<Processo[]>();
    const autoProcesso$ = autoProcesso.asObservable();
    this.processo$ = merge(autoProcesso$, this.form.controls.processo.valueChanges.pipe(
      filter((value: any) => !value.numero),
      filter(() => !this.processoIsBusy),
      tap(() => this.processoIsBusy = true),
      switchMap(val => this.processoService.filter(val)),
      tap(() => this.processoIsBusy = false)
    ));
    this.processoService.filter('').subscribe(arr => autoProcesso.next(arr));
  }

  private loadFormData(): void {
    if (this.route.snapshot.params['id']) {
      this.formMode = FormMode.UPDATE;
      this.autorizacaoService.show(this.route.snapshot.params['id']).subscribe({
        next: entity => {

          if (entity.id) {
            this.entity = { ...entity };
            // set autocomplete's
            this.form.controls.professor.setValue(<any>entity.professor);
            this.form.controls.processo.setValue(<any>entity.processo);
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
      this.entity = <Autorizacao>{};
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.entity = <Autorizacao>{
        ...this.entity,
        ...this.form.value
      };
      this.entity.professorId = this.entity.professor?.id || 0;
      this.entity.processoId = this.entity.processo?.id || 0;

      if (this.formMode === FormMode.INSERT) {
        this.autorizacaoService.store({ ...this.entity }).subscribe({
          next: () => {
            this.helper.alertSnack('Inserido com sucesso.');
            this.navigateToTable();
          }
        });
      } else {
        this.autorizacaoService.update(this.entity).subscribe({
          next: () => {
            this.helper.alertSnack('Atualizado com sucesso.');
            this.navigateToTable();
          }
        });
      }
    } else this.form.markAllAsTouched();
  }

  navigateToTable() {
    this.router.navigate(['autorizacao']);
  }

}

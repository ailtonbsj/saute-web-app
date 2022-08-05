import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode } from 'src/app/shared/form-mode';
import { HelperService } from 'src/app/shared/helper.service';
import { NivelEscolar } from '../nivel-escolar.model';
import { NivelEscolarService } from '../nivel-escolar.service';

@Component({
  selector: 'app-nivel-escolar-form',
  templateUrl: './nivel-escolar-form.component.html',
  styleUrls: ['./nivel-escolar-form.component.css']
})
export class NivelEscolarFormComponent implements OnInit {

  formMode: FormMode = FormMode.INSERT;
  entity: NivelEscolar = <NivelEscolar>{ id: 0 };

  form = new FormGroup({
    nivelEscolar: new FormControl('', [Validators.required])
  })

  constructor(
    private service: NivelEscolarService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: HelperService) { }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.formMode = FormMode.UPDATE;
      this.entity.id = this.route.snapshot.params['id'];
      this.service.show(this.route.snapshot.params['id']).subscribe({
        next: ent => {
          if (ent.id) {
            this.entity = ent;
            this.form.patchValue(ent);
          } else this.navigateToTable();
        }
      });
    } else {
      this.formMode = FormMode.INSERT;
      this.entity = <NivelEscolar>{};
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.entity = <NivelEscolar>{
        ...this.entity,
        ...this.form.value
      };
      if (this.formMode === FormMode.INSERT) {
        this.service.store({ ...this.entity }).subscribe({
          next: _ => {
            this.snack.alertSnack('Inserido com sucesso.');
            this.navigateToTable();
          }
        });
      } else {
        this.service.update({ ...this.entity }).subscribe({
          next: _ => {
            this.snack.alertSnack('Atualizado com sucesso.');
            this.navigateToTable();
          }
        });
      }
    } else this.form.markAllAsTouched();
  }

  navigateToTable() {
    this.router.navigate(['nivelescolar']);
  }

}

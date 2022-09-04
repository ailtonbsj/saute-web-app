import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { FileReaderFormat, HelperService } from 'src/app/shared/helper.service';
import { ConfiguracoesService } from '../configuracoes.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {

  api = localStorage.getItem('api') || 'local';
  apiEnabled = false;

  fileBackup: any;

  form = this.fb.group({
    text: [''],
    sign1: [''],
    sign2: [''],
    api: ['']
  });
  logo1: File = <File>{};
  logo2: File = <File>{};

  logo1Blob: string = '/assets/logo1.png';
  logo2Blob: string = '/assets/logo2.png';

  constructor(
    private service: ConfiguracoesService,
    private helper: HelperService,
    private fb: FormBuilder
  ) {
    this.apiEnabled = this.api !== 'local';
  }

  ngOnInit(): void {
    this.form.controls.api.setValue(localStorage.getItem('api') || '');
    this.service.getDataReport().subscribe({
      next: confs => {
        if (confs) {
          this.form.patchValue(confs);
          if (confs.logo1) this.logo1Blob = confs.logo1;
          if (confs.logo2) this.logo2Blob = confs.logo2;
        }
      }
    });
  }

  onBackup() {
    this.service.backup().subscribe({
      next: db => {
        const blob = new Blob([db], { type: 'text/json' });
        const a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'bkp_' + (+ new Date()) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

  onClear() {
    this.helper.confirmDialog().pipe(
      filter(res => res),
      switchMap(res => {
        return this.service.clear();
      })
    ).subscribe({
      next: _ => {
        this.helper.alertSnack('Bancos removidos com sucesso! Você será redirecionado em 3 segundos!');
        setTimeout(() => window.location.href = '/', 3500);
      }
    });

  }

  onRestore() {
    if (this.fileBackup) {
      this.helper.fileReader(this.fileBackup, FileReaderFormat.TEXT)
        .then(str => {
          try {
            const data = JSON.parse(str);
            this.service.restore(data).subscribe({
              next: () => this.helper.alertSnack('Restaurado!'),
              error: () => this.helper.alertSnack('Erro ao tentar restaurar!')
            });
          } catch (error) {
            this.helper.alertSnack('Erro ao tentar restaurar!')
          }

        })
    }
  }

  onChooseFile(ev: Event) {
    this.fileBackup = (<HTMLInputElement>ev.target).files?.item(0);
  }

  chooseLogo1(ev: Event) {
    const file = (<HTMLInputElement>ev.target).files?.item(0);
    if (file) {
      this.helper.fileReader(file)
        .then(blob => this.helper.image(blob))
        .then(image => this.logo1Blob = this.helper.resizePicute(image, 500));
    }
  }

  chooseLogo2(ev: Event) {
    const file = (<HTMLInputElement>ev.target).files?.item(0);
    if (file) {
      this.helper.fileReader(file)
        .then(blob => this.helper.image(blob))
        .then(image => this.logo2Blob = this.helper.resizePicute(image, 500));
    }
  }

  saveDataReport() {
    if (this.form.value.api !== '')
      localStorage.setItem('api', <string>this.form.value.api);
    const data: any = {
      ...this.form.value
    };
    delete data.api;
    if (this.logo1Blob !== '/assets/logo1.png') data.logo1 = this.logo1Blob;
    if (this.logo2Blob !== '/assets/logo2.png') data.logo2 = this.logo2Blob;

    this.service.saveDataReport(data).subscribe({
      next: () => this.helper.alertSnack('Configurações salvas!')
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { filter, switchMap } from 'rxjs';
import { FileReaderFormat, HelperService } from 'src/app/shared/helper.service';
import { ConfiguracoesService } from '../configuracoes.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {

  fileBackup: any;

  constructor(private service: ConfiguracoesService, private helper: HelperService) { }

  ngOnInit(): void {
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

}

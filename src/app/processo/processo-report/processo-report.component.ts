import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { EMPTY, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { Autorizacao } from 'src/app/autorizacao/autorizacao.model';
import { AutorizacaoService } from 'src/app/autorizacao/autorizacao.service';
import { ConfiguracoesService } from 'src/app/configuracoes/configuracoes.service';
import { Instituicao } from 'src/app/instituicao/instituicao.model';
import { HelperService } from 'src/app/shared/helper.service';
import { Processo } from '../processo.model';
import { ProcessoService } from '../processo.service';

@Component({
    selector: 'app-processo-report',
    templateUrl: './processo-report.component.html',
    styleUrls: ['./processo-report.component.css'],
    standalone: false
})
export class ProcessoReportComponent implements OnInit {

  processo: Processo = <Processo>{};
  instituicao: Instituicao = <Instituicao>{ endereco: {} };
  autorizacoes$: Observable<Autorizacao[]> = EMPTY;
  dataAtual: Date = new Date();
  confs: any = {};
  confSubs: Subscription = <Subscription>{};

  constructor(
    private processoService: ProcessoService,
    private autorizacaoService: AutorizacaoService,
    private confService: ConfiguracoesService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.confSubs = this.confService.getDataReport().subscribe(confs => {
        if (confs) this.confs = confs;
        else this.router.navigate(['processo']);
      });

      this.autorizacoes$ = this.processoService.show(this.route.snapshot.params['id']).pipe(
        map((ent: Processo) => {
          this.processo = ent;
          this.instituicao = <Instituicao>ent.instituicao;
          return this.processo.id
        }),
        switchMap(procId => this.autorizacaoService.getByProcess(procId || 0))
      );
    }
    else this.router.navigate(['processo']);
  }

  ngOnDestroy() {
    this.confSubs.unsubscribe();
  }

  onPrint() {
    window.print();
  }

  saveToPDF() {
    let element = document.querySelector('.page');
    let opt = {
      margin: 0.9,
      filename: 'report.pdf',
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    // html2pdf().set(opt).from(element).save();
    html2pdf().set(<any>opt).from(<HTMLElement>element).toPdf().get('pdf').then(function (pdf: any) {
      window.open(pdf.output('bloburl'), '_blank');
    });
  }

}

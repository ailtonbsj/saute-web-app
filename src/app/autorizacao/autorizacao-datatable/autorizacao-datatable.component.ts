import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, map, max, of, switchMap, tap } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { Autorizacao } from '../autorizacao.model';
import { AutorizacaoService } from '../autorizacao.service';
import { jsPDF } from 'jspdf';
import { InstituicaoService } from 'src/app/instituicao/instituicao.service';
import { Instituicao } from 'src/app/instituicao/instituicao.model';
import { ConfiguracoesService } from 'src/app/configuracoes/configuracoes.service';

@Component({
  selector: 'app-autorizacao-datatable',
  templateUrl: './autorizacao-datatable.component.html',
  styleUrls: ['./autorizacao-datatable.component.css']
})
export class AutorizacaoDatatableComponent implements OnInit {

  isLoadingData = true;
  isEnabledFilter = false;
  displayedColumns: string[] = ['numero', 'professorId', 'processoId', 'createdAt', 'updatedAt', 'actions'];

  dataSource: MatTableDataSource<Autorizacao> = new MatTableDataSource(<Autorizacao[]>[]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort) sort: MatSort = <MatSort>{};

  constructor(
    private service: AutorizacaoService,
    private instituicaoService: InstituicaoService,
    private router: Router,
    private helper: HelperService,
    private confService: ConfiguracoesService) {
    this.loadDatatable();
  }

  ngOnInit(): void {
  }

  loadDatatable() {
    this.service.index().subscribe({
      next: ent => {
        this.dataSource = new MatTableDataSource(ent);
        this.dataSource.sortingDataAccessor = HelperService.nestedSortingDataAccessor;
        this.dataSource.filterPredicate = HelperService.nestedFilterPredicate;

        if (this.sort.sortables) this.dataSource.sort = this.sort;
        if (this.paginator.page) this.dataSource.paginator = this.paginator;
        this.isLoadingData = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onUpdate(id: number) {
    this.router.navigate([`autorizacao/${id}/edit`]);
  }

  onDelete(id: number) {
    this.helper.confirmDialog().pipe(
      filter(res => res),
      switchMap(res => {
        return this.service.destroy(id)
      })
    ).subscribe({
      next: _ => {
        this.helper.alertSnack('Removido com sucesso!');
        this.refreshComponent();
      }
    });
  }

  async onReport(id: number) {
    const pageWidth = 210;
    const pageHeight = 297;
    const margTop = 10;
    const margLeft = 10;
    const contentWidth = pageWidth - 2 * margLeft;
    const contentHeight = pageHeight - 2 * margTop;
    const headerHeight = 23;
    const bodyTop = margTop + headerHeight;
    const centerWidth = pageWidth / 2;

    let autorizacao: Autorizacao;
    let instituicao: Instituicao;
    let logo1Blob: string;
    let logo2Blob: string;
    let doc: jsPDF;

    let sign1 = 'Orientador(a) da SETOR - SAUTE';
    let sign2 = 'Coordenador(a) Regional da SAUTE';
    let text = 'A Coordenadora da Instituição SAUTE, no uso das atribuições que lhe são conferidas pelo Art. 20 da resolução 372/2022 e Parecer 0658/2003 do Conselho, conforme requerimento do(s) professor(es) relacionado(s) neste processo, com suas respectivas disciplinas e níveis, RESOLVE: Conceder Autorização Temporária para lecionar(em) na instituição abaixo identificada, com VALIDADE ATÉ O FINAL DESTE ANO LETIVO.';
    this.service.show(id).pipe(
      map(auth => { autorizacao = auth; return auth.processo?.instituicaoId }),
      switchMap(id => this.instituicaoService.show(<number>id)),
      tap(inst => instituicao = inst),
      switchMap(() => this.confService.getDataReport()),
      tap(data => {
        if (data) {
          if (data.sign1) sign1 = data.sign1;
          if (data.sign2) sign2 = data.sign2;
          if (data.text) text = data.text;
          if (data.logo1) logo1Blob = data.logo1;
          if (data.logo2) logo2Blob = data.logo2;
        }
      }),
      switchMap(() => this.helper.fetchToBlob('/assets/logo1.png', 'image/png')),
      tap(blob => { if (!logo1Blob) { logo1Blob = blob } }),
      switchMap(() => this.helper.fetchToBlob('/assets/logo2.png', 'image/png')),
      tap(blob => { if (!logo2Blob) { logo2Blob = blob } }),
      switchMap(() => autorizacao.professor?.foto ?
        this.helper.image(<string>autorizacao.professor?.foto) : of(undefined))
    ).subscribe({
      next: (foto: any) => {

        doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        doc.addImage(logo1Blob, 'png', margLeft, margTop, 70, headerHeight);
        doc.addImage(logo2Blob, 'png', pageWidth - margLeft - 70, margTop, 70, headerHeight);

        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.text('SISTEMA DE AUTORIZAÇÃO TEMPORÁRIA - SAUTE', centerWidth, bodyTop + 8, {
          maxWidth: contentWidth,
          align: 'center',
          renderingMode: 'fill'
        });
        doc.text('PROCESSO Nº ' + autorizacao.processo?.numero, centerWidth, bodyTop + 14, {
          maxWidth: contentWidth,
          align: 'center',
          renderingMode: 'fill'
        });

        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        doc.text(text, margLeft, bodyTop + 22, {
          align: 'justify',
          maxWidth: contentWidth - 1
        });

        let data: any = {};
        data["Instituição"] = instituicao.instituicao;
        data["Nível"] = instituicao.nivelEscolar?.nivelEscolar;
        data["Endereço"] = instituicao.endereco.rua;
        data["Número"] = instituicao.endereco.numero;
        data["Bairro"] = instituicao.endereco.bairro;
        data["Município"] = instituicao.endereco.municipio;
        data["CEP"] = instituicao.endereco.cep;
        data["E-mail"] = instituicao.email;
        data["Dependência"] = instituicao.dependencia;
        data["Entidade"] = instituicao.entidade;
        data["Credenciamento"] = instituicao.credenciamento;
        data["Validade do Credenciamento"] = instituicao.valorCredenciamento;
        data["Recredenciamento"] = instituicao.recredenciamento;
        data["Validade do Recredenciamento"] = instituicao.valorRecredenciamento;

        doc.setFont('times', 'normal');
        doc.setFontSize(12);

        let colunmOne = true;
        let space = 0;
        let item = 0;
        Object.keys(data).map((key, i) => {
          item = i;
          if (colunmOne) {
            space = 0;
          } else {
            space = 100;
            item--;
          }
          colunmOne = !colunmOne;
          doc.text(key + ': ' + data[key], margLeft + space, bodyTop + 55 + 3 * item, {
            align: 'justify',
            maxWidth: contentWidth - 1
          });

        });

        data = {};
        data["Autorização"] = autorizacao.numero;
        data["Nome"] = autorizacao.professor?.nome;
        data["CPF"] = autorizacao.professor?.cpf;
        data["Referendum"] = autorizacao.referendum;


        Object.keys(data).map((key, i) => {

          doc.text(key + ': ' + data[key], margLeft, bodyTop + 100 + 5 * i, {
            align: 'justify',
            maxWidth: (contentWidth / 2) - 10
          });

        });

        if (foto) {
          const height = 52 * (foto.height / foto.width);
          doc.addImage(foto, 'png', margLeft + 100, bodyTop + 96, 52, height);
        }

        doc.text('________________________________' + sign1,
          centerWidth - 50, contentHeight - 10, {
          maxWidth: 70,
          align: 'center'
        });

        doc.text('________________________________' + sign2,
          centerWidth + 50, contentHeight - 10, {
          maxWidth: 70,
          align: 'center'
        });

        doc.output('dataurlnewwindow');

      }
    });
  }

  refreshComponent() {
    this.router.navigateByUrl('nivelescolar', { skipLocationChange: true }).then(() => {
      this.router.navigate(['autorizacao']);
    });
  }

}

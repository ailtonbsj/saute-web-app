import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracoesRoutingModule } from './configuracoes-routing.module';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    ConfiguracoesComponent
  ],
  imports: [
    CommonModule,
    ConfiguracoesRoutingModule,
    MaterialModule
  ]
})
export class ConfiguracoesModule { }

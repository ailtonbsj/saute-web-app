import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'saute-web';

  about() {
    window.alert('Esse projeto é um estudo de caso baseado no projeto SAUTE do Mario Rocha feito anteriormente em Lazarus (Free Delphi).\nEssa versão roda totalmente no browser usando o banco de dados embutido IndexedDB.');
  }
}

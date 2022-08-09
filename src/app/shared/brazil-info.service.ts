import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, of, take } from 'rxjs';
import { BrazilCity, BrazilState } from './brazil-info';

@Injectable({
  providedIn: 'root'
})
export class BrazilInfoService {

  constructor(private http: HttpClient) { }

  getStates() {
    return this.http.get<BrazilState[]>('assets/brazil/states.json').pipe(take(1));
  }

  getCityByName(query: string) {
    return this.http.get<BrazilCity[]>('assets/brazil/cities.json').pipe(
      map(list => list.find(i => i.nome.toLowerCase() === query.toLowerCase())),
      take(1)
    );
  }

  filterCities(query: string, uf?: string, limit?: number) {
    const text = query.toLowerCase().replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
    let limitMax = 10;
    if (limit) limitMax = limit;

    return this.http.get<BrazilCity[]>('assets/brazil/cities.json').pipe(
      map(list => {
        const filter = [];
        for (let item of list) {
          if (uf && item.estado !== uf) continue;
          const test = new RegExp(text).test(item.nome.toLowerCase());
          if (!test) continue;
          filter.push(item);
          if (--limitMax === 0) break;
        }
        return filter
      }),
      delay(1), take(1)
    );
  }

  searchByCEP(cep: string) {
    if (cep != '') {
      if (/^[0-9]{8}$/.test(cep)) {
        return this.http.get(`//viacep.com.br/ws/${cep}/json/`).pipe(take(1));
      }
    }
    return of({}).pipe(take(1));
  }

}

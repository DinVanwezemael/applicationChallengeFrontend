import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maker } from '../models/maker.model';

@Injectable({
  providedIn: 'root'
})
export class MakerService {

  constructor(private http: HttpClient) { }

  //haalt alle gebruikers op en returned deze
  getMakerWhereId(Id:number): Observable<Maker> {
    return this.http.get<Maker>("https://localhost:44341/api/maker/"+Id);
  }
}

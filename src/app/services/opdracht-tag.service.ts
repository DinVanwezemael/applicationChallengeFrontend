import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OpdrachtTag } from '../models/opdrachtTag.model';

@Injectable({
  providedIn: 'root'
})
export class OpdrachtTagService {

  constructor(private http:HttpClient) { }
  getWhereBedrijfId(Id:number): Observable<OpdrachtTag[]> {
    return this.http.get<OpdrachtTag[]>("https://localhost:44341/api/opdrachttag/"+Id);
  };
  deleteAllWhereBedrijfId(Id:number): Observable<OpdrachtTag[]> {
    return this.http.delete<OpdrachtTag[]>("https://localhost:44341/api/opdrachttag/"+Id);
  };
  newOpdrachtTag(opdrachtTag:OpdrachtTag): Observable<OpdrachtTag> {
    return this.http.post<OpdrachtTag>("https://localhost:44341/api/opdrachttag/", opdrachtTag);
  };
}

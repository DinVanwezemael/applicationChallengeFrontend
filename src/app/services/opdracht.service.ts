import { Injectable } from '@angular/core';
import { Opdracht } from '../models/opdracht.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpdrachtService {

  constructor(private http:HttpClient) { }
  getWhereId(Id:number): Observable<Opdracht> {
    return this.http.get<Opdracht>("https://localhost:44341/api/opdracht/"+Id);
  };
  editOpdracht(Id:number,opdracht: Opdracht): Observable<Opdracht> {
    return this.http.put<Opdracht>("https://localhost:44341/api/opdracht/"+Id,opdracht);
  }
  newOpdracht(opdracht:Opdracht): Observable<Opdracht> {
    return this.http.post<Opdracht>("https://localhost:44341/api/opdracht/",opdracht);
  };
  deleteOpdracht(Id:number): Observable<Opdracht> {
    return this.http.delete<Opdracht>("https://localhost:44341/api/opdracht/"+Id);
  };
}

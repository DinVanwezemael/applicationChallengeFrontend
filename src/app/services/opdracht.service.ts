import { Injectable } from '@angular/core';
import { Opdracht } from '../models/opdracht.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpdrachtMaker } from '../models/opdracht-maker.model';

@Injectable({
  providedIn: 'root'
})
export class OpdrachtService {

  constructor(private http:HttpClient) { }
  getWhereId(Id:number): Observable<Opdracht> {
    return this.http.get<Opdracht>("https://localhost:44341/api/opdracht/"+Id);
  }

  getVoted(Id:number, opdracht: OpdrachtMaker): Observable<OpdrachtMaker> {
    return this.http.put<OpdrachtMaker>("https://localhost:44341/api/opdrachtmaker/get"+Id, opdracht);
  }

  editOpdracht(Id:number,opdracht: Opdracht): Observable<Opdracht> {
    return this.http.put<Opdracht>("https://localhost:44341/api/opdracht/"+Id,opdracht);
  }

  getOpdrachtenVoorStudent(): Observable<Opdracht[]>{
    return this.http.get<Opdracht[]>("https://localhost:44341/api/opdracht");
  }

  getOpdrachtenVoorStudentOpen(): Observable<Opdracht[]>{
    return this.http.get<Opdracht[]>("https://localhost:44341/api/opdracht/open");
  }

  getOpdrachtenVoorStudentId(id: number): Observable<any[]>{
    return this.http.get<any[]>("https://localhost:44341/api/opdrachtmaker/" + id);
  }

  getOpdrachtenVoorStudentBySearch(title: string): Observable<Opdracht[]>{
    return this.http.get<Opdracht[]>("https://localhost:44341/api/opdracht/search" + title);
  }

  newOpdracht(opdracht:Opdracht): Observable<Opdracht> {
    return this.http.post<Opdracht>("https://localhost:44341/api/opdracht/",opdracht);
  };

  deleteOpdracht(Id:number): Observable<Opdracht> {
    return this.http.delete<Opdracht>("https://localhost:44341/api/opdracht/"+Id);
  }
}

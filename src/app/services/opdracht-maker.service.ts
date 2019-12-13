import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpdrachtMaker } from '../models/opdracht-maker.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpdrachtMakerService {

  constructor(private http:HttpClient) { }


  insertDeelname(opdrachtMaker: OpdrachtMaker){
    return this.http.post<OpdrachtMaker>("https://localhost:44341/api/opdrachtmaker", opdrachtMaker);
  }
 accepteerDeelname(id:number,opdrachtMaker: OpdrachtMaker){
    return this.http.put<OpdrachtMaker>("https://localhost:44341/api/opdrachtmaker/"+id, opdrachtMaker);
  }
  deleteDeelname(id: number){
    return this.http.delete("https://localhost:44341/api/opdrachtmaker/" + id);
  }
  getDeelnameWhereOpdrachtId(id:number): Observable<OpdrachtMaker[]>{
    return this.http.get<OpdrachtMaker[]>("https://localhost:44341/api/opdrachtmaker/getid/"+id);
  }


}

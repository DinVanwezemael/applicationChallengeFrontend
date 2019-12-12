import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpdrachtMaker } from '../models/opdracht-maker.model';

@Injectable({
  providedIn: 'root'
})
export class OpdrachtMakerService {

  constructor(private http:HttpClient) { }


  insertDeelname(opdrachtMaker: OpdrachtMaker){
    return this.http.post<OpdrachtMaker>("https://localhost:44341/api/opdrachtmaker", opdrachtMaker);
  }
}

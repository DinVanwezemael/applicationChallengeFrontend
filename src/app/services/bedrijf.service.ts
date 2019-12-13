import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bedrijf } from '../models/bedrijf.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BedrijfService {

  constructor(private http: HttpClient) { }

  //haalt alle gebruikers op en returned deze
  getBedrijfWhereId(Id:number): Observable<Bedrijf> {
    return this.http.get<Bedrijf>("https://localhost:44341/api/bedrijf/"+Id);
  }

  updateBedrijf(Id: number, bedrijf: Bedrijf){
    return this.http.put<Bedrijf>("https://localhost:44341/api/bedrijf/"+Id, bedrijf);
  }

  getGemiddeldeScoreBedrijf(bedrijfId :number){
    return this.http.get("https://localhost:44341/api/review/getReviewsBedrijf/" + bedrijfId);
  }
}

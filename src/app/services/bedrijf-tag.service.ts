import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BedrijfTag } from '../models/bedrijfTag.model';

@Injectable({
  providedIn: 'root'
})
export class BedrijfTagService {


  constructor(private http:HttpClient) { }
  getWhereBedrijfId(Id:number): Observable<BedrijfTag[]> {
    return this.http.get<BedrijfTag[]>("https://localhost:44341/api/bedrijftag/"+Id);
  };
  deleteAllWhereBedrijfId(Id:number): Observable<BedrijfTag[]> {
    return this.http.delete<BedrijfTag[]>("https://localhost:44341/api/bedrijftag/"+Id);
  };
  newBedrijfTag(bedrijfTag:BedrijfTag): Observable<BedrijfTag> {
    console.log(bedrijfTag);
    return this.http.post<BedrijfTag>("https://localhost:44341/api/bedrijftag/", bedrijfTag);
  };
}

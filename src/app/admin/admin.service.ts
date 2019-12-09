import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Maker } from '../models/maker.model';
import { Observable } from 'rxjs';
import { Bedrijf } from '../models/bedrijf.model';

@Injectable()
export class AdminService {

  constructor(private _httpClient: HttpClient) { }

  getMakers(): Observable<Maker[]> {
    return this._httpClient.get<Maker[]>("https://localhost:44341/api/maker");
  }
  
  getBedrijven(): Observable<Bedrijf[]> {
    return this._httpClient.get<Bedrijf[]>("https://localhost:44341/api/bedrijf");
  }
}

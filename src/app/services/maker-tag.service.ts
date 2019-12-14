import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MakerTag } from '../models/maker-tag.model';

@Injectable({
  providedIn: 'root'
})
export class MakerTagService {

  constructor(private http:HttpClient) { }
  getWhereMakerId(Id:number): Observable<MakerTag[]> {
    return this.http.get<MakerTag[]>("https://localhost:44341/api/makerTag/gettags/"+Id);
  };
  deleteAllWhereMakerId(Id:number) {
    return this.http.delete("https://localhost:44341/api/makertag/"+Id);
  };
  newMakerTag(makerTag:MakerTag) {
    return this.http.post<MakerTag>("https://localhost:44341/api/makertag", makerTag);
  };

  editTags(makerid: number, makerTag:MakerTag): Observable<MakerTag> {
    return this.http.put<MakerTag>("https://localhost:44341/api/makertag/edittags/" + makerid, makerTag);
  }
}

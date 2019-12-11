import { Injectable } from '@angular/core';
import { Tag } from '../models/tag.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http:HttpClient) { }
  newTag(tag:Tag): Observable<Tag> {
    return this.http.post<Tag>("https://localhost:44341/api/tag/", tag);
  };
}

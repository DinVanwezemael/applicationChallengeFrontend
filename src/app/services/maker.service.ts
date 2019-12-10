import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maker } from '../models/maker.model';

@Injectable({
  providedIn: 'root'
})
export class MakerService {

  constructor(private http: HttpClient) { }

  //haalt alle gebruikers op en returned deze
  getMakerWhereId(Id:number): Observable<Maker> {
    return this.http.get<Maker>("https://localhost:44341/api/maker/"+Id);
  }
  uploadFoto(fileToUpload: File): Observable<Object> {
    const endpoint = 'https://localhost:44341/api/image';
    const uploadData = new FormData();
    uploadData.append('File', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, uploadData);

  
}
deleteOldFoto(fileName:String){
  const endpoint = 'https://localhost:44341/api/image/';
  return this.http.delete(endpoint+fileName);

}
updateMaker(Maker:Maker,fotoNaam:string): Observable<Maker> {
  Maker.foto=fotoNaam;
  console.log(Maker); 
  return this.http.put<Maker>("https://localhost:44341/api/maker/"+Maker.id,Maker);
}
}

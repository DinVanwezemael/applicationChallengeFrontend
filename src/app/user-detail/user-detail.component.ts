import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import * as jwtDecode from 'jwt-decode';
import { MakerService } from '../services/maker.service';
import { Maker } from '../models/maker.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  triggered: Boolean = false;
  profielfoto;
  fileToUpload: File = null;
  Maker:Maker;
  nieuweFotoNaam;
  constructor(private _MakerService: MakerService) { 
    
  }

  ngOnInit() {
    this.triggered=false;
this.haalMakerOp();
  }
  openFotoUpload(){
    if(this.triggered===true){
      this.triggered= false;
    }else{
      this.triggered = true;

    }
  }
  handleFileInput(files: FileList) {
    this._MakerService.uploadFoto(files.item(0)).subscribe(data => {
      }, error => {
        console.log("upload ok")
        this.nieuweFotoNaam= error.error.text
        this._MakerService.deleteOldFoto(this.Maker.foto).subscribe(result =>{
          console.log("delete ok")
        });
          
this._MakerService.updateMaker(this.Maker,this.nieuweFotoNaam).subscribe(result=>{
this.haalMakerOp();
this.triggered= false;
});
      });
}
haalMakerOp(){
  const token = localStorage.getItem('token')
  const tokenPayload : any = jwtDecode(token);
  if(tokenPayload.role = "Maker"){
    this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
      this.Maker = result;
      this.profielfoto = "https://localhost:44341/images/"+this.Maker.foto;
    });
  }
}
}

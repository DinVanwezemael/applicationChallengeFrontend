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
  uploader:FileUploader;
  profielfoto = "https://localhost:44341/images/jelle.jpeg"
  Maker:Maker;
  constructor(private _MakerService: MakerService) { 
  }

  ngOnInit() {
    this.triggered=false;
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    if(tokenPayload.role = "Maker"){
      this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.Maker = result;
        console.log(result)
      });
    }
  }
  openFotoUpload(){
    if(this.triggered===true){
      this.triggered= false;
    }else{
      this.triggered = true;

    }
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from '../authentication/models/user.model';
import { AuthenticateService } from '../authentication/services/authenticate.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as jwtDecode from 'jwt-decode';
import { MakerService } from '../services/maker.service';
import { Maker } from '../models/maker.model';
import { Bedrijf } from '../models/bedrijf.model';
import { BedrijfService } from '../services/bedrijf.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  triggered: Boolean = false;

  user: Observable<User>;
  editMaker = false;
  editBedrijf = false;

  vbedrijf = false;
  vmaker = false;

  profilePicName
  //maker:any;
  bedrijf: Bedrijf;
  id
  username
  gebruikerid
  UserLoginId

  token = localStorage.getItem('token')
  tokenPayload : any = jwtDecode(this.token);
  

  constructor(private authenticateService: AuthenticateService, private fb: FormBuilder, private _MakerService: MakerService, private _BedrijfService: BedrijfService) { 
  }

  profielfoto;
  fileToUpload: File = null;
  maker:Maker;
  nieuweFotoNaam;
  userForm: FormGroup;
  bedrijfForm: FormGroup;




  


 

  openFotoUpload(){
    if(this.triggered===true){
      this.triggered= false;
    }else{
      this.triggered = true;

    }
  }

  haalMakerOp(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    if(tokenPayload.role == "Maker"){
      this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.maker = result;
        this.vmaker = true;
        this.vbedrijf = false;
        if(result.foto == null){
          this.profielfoto = "https://api.adorable.io/avatars/285/" + result.id + "@adorable.png";
        }
        else{
          this.profielfoto = "https://localhost:44341/images/"+this.maker.foto;
        }
      });
    }
    if(tokenPayload.role == "Bedrijf"){
      this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.bedrijf = result;
        this.vbedrijf = true;
        this.vmaker = false;
        if(result.foto == null){
          this.profielfoto = "https://api.adorable.io/avatars/285/" + result.id + "@adorable.png";
        }
        else{
          this.profielfoto = "https://localhost:44341/images/"+this.bedrijf.foto;
        }
      });
    }
  } 


  

  ngOnInit() {
    this.triggered=false;

    this.haalMakerOp();

  }
  

   handleFileInput(files: FileList) {
    this._MakerService.uploadFoto(files.item(0)).subscribe(data => {
      }, error => {
        console.log("upload ok")
        this.nieuweFotoNaam= error.error.text
        if(this.profielfoto != "Template.jpg"){
          this._MakerService.deleteOldFoto(this.profielfoto).subscribe(result =>{
            console.log("delete ok")
          });
        }

        const token = localStorage.getItem('token')
        const tokenPayload : any = jwtDecode(token);
        if(tokenPayload.role == "Maker"){
            this._MakerService.updateMaker(this.maker,this.nieuweFotoNaam).subscribe(result=>{
              this.haalMakerOp();
              this.triggered= false;
              });
          }else{
            this.bedrijf.foto= this.nieuweFotoNaam;
            this._BedrijfService.updateBedrijf(this.bedrijf.id,this.bedrijf).subscribe(result=>{
              this.haalMakerOp();
              this.triggered= false;
              });
          }

});
} 




}



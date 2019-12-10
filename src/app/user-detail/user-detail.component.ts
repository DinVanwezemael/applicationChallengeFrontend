import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
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
  uploader:FileUploader;

  user: Observable<User>;
  editMaker = false;
  editBedrijf = false;

  vbedrijf = false;
  vmaker = false;

  profilePicName
  maker:any;
  bedrijf: Bedrijf;
  id
  username
  gebruikerid
  UserLoginId

  token = localStorage.getItem('token')
  tokenPayload : any = jwtDecode(this.token);
  

  constructor(private authenticateService: AuthenticateService, private fb: FormBuilder, private _MakerService: MakerService, private _BedrijfService: BedrijfService) { 
    this.getUsername();
  }

  profielfoto;
  fileToUpload: File = null;
  Maker:Maker;
  nieuweFotoNaam;
  userForm: FormGroup;
  bedrijfForm: FormGroup;


  

  editUserDetails(){
    if(this.editMaker == true || this.editBedrijf == true){
      this.editMaker = false;
      this.editBedrijf = false;
    }
    else{
      this.editMaker = true;
      this.editBedrijf = true;
    }
  }

 /*  ngOnInit() {
    this.triggered=false;
this.haalMakerOp();
  } */

  infoUser(){
    this.user = this.authenticateService.getUserInfo();
  }


  //gegevens van maker veranderen
  saveChangesMaker(){

    this.authenticateService.editUser(this.userForm.controls['Id'].value , this.userForm.value).subscribe(
      result => {
        this.editMaker = false;
      },
      err => {
        alert("username bestaat al")
      }
    );

      let user: User = {
        userID: this.UserLoginId,
        username: this.userForm.controls["Nickname"].value,
        email: this.userForm.controls["Email"].value,
        password: null,
        token: null
      } 

    this.authenticateService.editUsername(this.UserLoginId, user).subscribe(
      result => {
        this.maker = result;
      },
      err => {
        console.log("username fail");
      }
    );
  }


  //gegevens van bedrijf veranderen
  saveChangesBedrijf(){
    console.log(this.bedrijfForm.value);
    this._BedrijfService.updateBedrijf(this.bedrijfForm.controls['Id'].value , this.bedrijfForm.value).subscribe(
      result => {
        this.getBedrijf();
        this.editBedrijf = false;
      },
      err => {
        alert("username bestaat al");
      }
    )
  }

  openFotoUpload(){
    if(this.triggered===true){
      this.triggered= false;
    }else{
      this.triggered = true;

    }
  }


  getBedrijf(){
    this._BedrijfService.getBedrijfWhereId(this.tokenPayload.GebruikerId).subscribe();
  }

  getMaker(){
    this._MakerService.getMakerWhereId(this.tokenPayload.GebruikerId).subscribe();
  }

  getUsername(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.username = tokenPayload.Username;
    console.log(this.username);
  }

  ngOnInit() {
    this.triggered=false;

    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.username = tokenPayload.Username;
    this.gebruikerid = tokenPayload.GebruikerId;
    this.UserLoginId = tokenPayload.UserLoginId;

    //user is een maker
    if(tokenPayload.role == "Maker"){
      this.vmaker = true;
      this.vbedrijf = false;
      this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.maker = result;
        this.id = result.id;
        this.profilePicName = "https://localhost:44341/images/" + result.foto;
      });
    }

    //bedrijf ophalen
      if(tokenPayload.role == "Bedrijf"){
        this.vbedrijf = true;
        this.vmaker = false;
        this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
          this.bedrijf = result;
          console.log(result);
          this.id = result.id;
          this.profilePicName = "https://localhost:44341/images/" + result.foto;
        });
      }
    
  

      //form van maker
    this.userForm = this.fb.group({
      Nickname: new FormControl('', Validators.required),
      Voornaam: new FormControl('', Validators.required),
      Achternaam: new FormControl('', Validators.required),
      Email: new FormControl('', Validators.required),
      Biografie: new FormControl('', Validators.required),
      LinkedInLink: new FormControl('', Validators.required),
      Ervaring: new FormControl('', Validators.required),
      GsmNr: new FormControl('', Validators.required),
      CV: new FormControl('', Validators.required),
      Foto: new FormControl('', Validators.required),
      GeboorteDatum: new FormControl('', Validators.required),
      Id: new FormControl('', Validators.required)
    })


    //form van bedrijf
    this.bedrijfForm = this.fb.group({
      Naam: new FormControl('', Validators.required),
      Adres: new FormControl('', Validators.required),
      Biografie: new FormControl('', Validators.required),
      Foto: new FormControl('', Validators.required),
      Id: new FormControl('', Validators.required),
      IdMaker: new FormControl('', Validators.required)
    })
  
    
  
  }
  

  
  

  /* handleFileInput(files: FileList) {
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
} */
/* haalMakerOp(){
  const token = localStorage.getItem('token')
  const tokenPayload : any = jwtDecode(token);
  if(tokenPayload.role = "Maker"){
    this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
      this.Maker = result;
      this.profielfoto = "https://localhost:44341/images/"+this.Maker.foto;
    });
  }
} */
}



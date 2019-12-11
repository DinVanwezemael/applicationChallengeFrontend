import { Component, OnInit } from '@angular/core';
import { MakerService } from 'src/app/services/maker.service';
import * as jwtDecode from 'jwt-decode';
import { Maker } from 'src/app/models/maker.model';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { User } from 'src/app/authentication/models/user.model';

@Component({
  selector: 'app-maker',
  templateUrl: './maker.component.html',
  styleUrls: ['./maker.component.scss']
})
export class MakerComponent implements OnInit {

  constructor(private _MakerService: MakerService, private fb: FormBuilder, private authenticateService: AuthenticateService) { }

  maker: Maker;
  profielfoto
  username
  editMaker
  UserLoginId



  userForm = this.fb.group({
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


  editUserDetails(){
    if(this.editMaker == true){
      this.editMaker = false;
    }
    else{
      this.editMaker = true;
    }
  }

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
        //this.maker = result;
      },
      err => {
      }
    );
  }


  haalMakerOp(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.UserLoginId = tokenPayload.UserLoginId;
    if(tokenPayload.role = "Maker"){
      this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.maker = result;
        console.log(result);
        this.profielfoto = "https://localhost:44341/images/"+this.maker.foto;
      });
    }
  } 

  getUsername(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.username = tokenPayload.Username;
    console.log(this.username);
  }

  ngOnInit() {
    this.haalMakerOp();
    this.getUsername();
  }

 

}

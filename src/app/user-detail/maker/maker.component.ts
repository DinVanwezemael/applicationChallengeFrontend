import { Component, OnInit } from '@angular/core';
import { MakerService } from 'src/app/services/maker.service';
import * as jwtDecode from 'jwt-decode';
import { Maker } from 'src/app/models/maker.model';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { User } from 'src/app/authentication/models/user.model';
import { UserLogin } from 'src/app/models/user-login.model';
import { ToastService } from 'src/app/toast-global/toast-service';

@Component({
  selector: 'app-maker',
  templateUrl: './maker.component.html',
  styleUrls: ['./maker.component.scss']
})
export class MakerComponent implements OnInit {

  constructor(private _MakerService: MakerService, private fb: FormBuilder, private authenticateService: AuthenticateService, private _authenticationService: AuthenticateService, private toastService: ToastService) { }

  maker: Maker;
  profielfoto
  username
  editMaker
  UserLoginId
  userInfo;



  userForm = this.fb.group({
    Nickname: new FormControl('', Validators.required),
    Voornaam: new FormControl('', Validators.required),
    Achternaam: new FormControl('', Validators.required),
    Email: new FormControl('', Validators.required),
    Biografie: new FormControl('', Validators.required),
    LinkedInLink: new FormControl('', Validators.required),
    Ervaring: new FormControl('', Validators.required),
    CV: new FormControl('', Validators.required),
    Foto: new FormControl('', Validators.required),
    GeboorteDatum: new FormControl('', Validators.required),
    Id: new FormControl('', Validators.required),
    Straat: new FormControl('', Validators.required),
    Nr: new FormControl('', Validators.required),
    Postcode: new FormControl('', Validators.required),
    Stad: new FormControl('', Validators.required),

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
        
      },
      err => {
        alert("username bestaat al")
      }
    );

      let user: UserLogin = {
        id : this.userForm.controls[('Id')].value,
        email: this.userForm.controls[('Email')].value,
        userTypeId: 2,
        username: this.userForm.controls[('Nickname')].value,
        bedrijfId: null,
        makerId: this.UserLoginId
      } 

    this.authenticateService.editUsername(this.UserLoginId, user).subscribe(
      result => {
        console.log(result);
        if(result == null){
          this.editMaker = true;
          this.toastService.show('De gebruikersnaam bestaat al!', { classname: 'bg-danger text-light', delay: 10000 });
        }
        else{
          this.editMaker = false;
          console.log("username is aangepast")
          this.toastService.show('Je gegevens zijn aangepast!', { classname: 'bg-success text-light', delay: 10000 });
        }
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
        console.log(result.foto);
        if(result.foto == null){
          this.profielfoto = "https://api.adorable.io/avatars/285/" + result.id + "@adorable.png";
        }
        else{
          this.profielfoto = "https://localhost:44341/images/"+this.maker.foto;
        }
      });

      this._authenticationService.userObject.subscribe(result => {
        this.userInfo = result;
      }) 
    }
  } 

  getUsername(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.username = tokenPayload.Username;
  }

  ngOnInit() {
    this.haalMakerOp();
    this.getUsername();
  }

 

}

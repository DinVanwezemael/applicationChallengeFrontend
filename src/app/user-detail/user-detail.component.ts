import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { User } from '../authentication/models/user.model';
import { AuthenticateService } from '../authentication/services/authenticate.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  triggered: Boolean = false;
  uploader:FileUploader;
  user: Observable<User>;
  edit = false;
  nameProfilePic = "";
  profielfoto = "https://localhost:44341/images/" + this.nameProfilePic;
  

  constructor(private authenticateService: AuthenticateService, private fb: FormBuilder) { 

  }
  userForm: FormGroup;

  

  editUserDetails(){
    this.edit = true;
  }

  infoUser(){
    this.user = this.authenticateService.getUserInfo();
  }

  saveChanges(){
    console.log(this.userForm.value);
    this.authenticateService.editUser(this.userForm.value).subscribe();
  }

  openFotoUpload(){
    if(this.triggered===true){
      this.triggered= false;
    }else{
      this.triggered = true;

    }
  }

  ngOnInit() {
    this.triggered=false;

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
      Id: new FormControl('', Validators.required),
    })

  }
  
}

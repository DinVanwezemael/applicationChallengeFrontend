import { Component, OnInit } from '@angular/core';
import { MakerService } from 'src/app/services/maker.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';
import * as jwtDecode from 'jwt-decode';
import { BedrijfService } from 'src/app/services/bedrijf.service';

@Component({
  selector: 'app-bedrijf',
  templateUrl: './bedrijf.component.html',
  styleUrls: ['./bedrijf.component.scss']
})
export class BedrijfComponent implements OnInit {

  constructor(private _BedrijfService: BedrijfService, private fb: FormBuilder, private authenticateService: AuthenticateService) { }

  bedrijf: Bedrijf;
  profielfoto
  username
  editBedrijf
  UserLoginId

  bedrijfForm = this.fb.group({
    Naam: new FormControl('', Validators.required),
    Adres: new FormControl('', Validators.required),
    Biografie: new FormControl('', Validators.required),
    Foto: new FormControl('', Validators.required),
    Id: new FormControl('', Validators.required)
  })

  editUserDetails(){
    if(this.editBedrijf == true){
      this.editBedrijf = false;
    }
    else{
      this.editBedrijf = true;
    }
  }

  saveChangesMaker(){

    this._BedrijfService.updateBedrijf(this.bedrijfForm.controls['Id'].value , this.bedrijfForm.value).subscribe(
      result => {
        this.editBedrijf = false;
      },
      err => {
        alert("username bestaat al");
      }
    )
  }


  haalMakerOp(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.UserLoginId = tokenPayload.UserLoginId;
    if(tokenPayload.role = "Bedrijf"){
      this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.bedrijf = result;
        console.log(result);
        this.profielfoto = "https://localhost:44341/images/"+this.bedrijf.foto;
      });
    }
  } 

  getUsername(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    console.log(tokenPayload.Username);
    this.username = tokenPayload.Username;
  }

  ngOnInit() {
    this.haalMakerOp();
    this.getUsername();
  }

}

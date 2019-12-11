import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { BedrijfService } from 'src/app/services/bedrijf.service';
import * as jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login = true;
  submitted = false;
  invalid = false;
  profielfoto

  constructor(private fb: FormBuilder, private _authenticationService: AuthenticateService, private router: Router, private appComponent: AppComponent, private _BedrijfService: BedrijfService) { }
  loginForm: FormGroup;
  registerForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      Username: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
    })

   // this.getUserDetails();
  }

  enableRegister() {
    this.login = false;
  }

  onEnableLogin(status: boolean) {
    this.login = status;
  }

  devMode(id: number) {
    switch (id) {
      case (1):
        this.loginForm.setValue({
          Username: "Admin",
          Password: "Admin1"
        })
        this.onLogin();
        break;
      case (2):
        this.loginForm.setValue({
          Username: "Student",
          Password: "Student1"
        })
        this.onLogin();
        break;
      case (3):
        this.loginForm.setValue({
          Username: "Bedrijf",
          Password: "Bedrijf1"
        })
        this.onLogin();
        break;
    }
  }

  onLogin() {
    this.submitted = true;
    this.invalid = false;
    console.log(this.loginForm.value);
    this._authenticationService.authenticate(this.loginForm.value).subscribe(result => {
      this._authenticationService.setToken(result.token);
      this._authenticationService.checkUser();
      console.log(result);

      localStorage.setItem("username", result.username);
      localStorage.setItem("naam", result.voornaam);
      localStorage.setItem("achternaam", result.achternaam);

      this.appComponent.username = result.username;
      this.appComponent.naam = result.naam;
      this.appComponent.achternaam = result.achternaam;

      switch (this._authenticationService.currentRole.value) {
        case ("Admin"):
          this.router.navigate(['adminHome']);
          break;
        case ("Maker"):
          this.router.navigate(['userdetail']);
          break;
        case ("Bedrijf"):
          this.router.navigate(['bedrijfOpdrachten']);
          break;
        default:
          this.router.navigate(['']);
          break;

      }
      console.log(result);
      this.submitted = false;
    }, err => {
      console.log(err);
      if (err.error.message = "Username or password is incorrect") {
        this.invalid = true;
      }
      this.submitted = false;
    }
    );

    
  }

  getUserDetails(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);

    if(tokenPayload.role == "Bedrijf"){
      this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        //localStorage.setItem("naam", result.voornaam)
        console.log(result);
        //this.profielfoto = "https://localhost:44341/images/"+this.bedrijf.foto;
      });
    }

    if(tokenPayload.role == "Maker"){
      this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        //localStorage.setItem("naam", result.voornaam)
        console.log(result);
        //this.profielfoto = "https://localhost:44341/images/"+this.bedrijf.foto;
      });
    }
    
  }

}

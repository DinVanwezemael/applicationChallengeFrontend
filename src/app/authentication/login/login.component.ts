import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { BedrijfService } from 'src/app/services/bedrijf.service';
import * as jwtDecode from 'jwt-decode';
import { FbAuthService } from '../services/fb-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login = 1;
  submitted = false;
  invalid = false;
  profielfoto
  invalidVerified = false;

  constructor(private FbAuthService: FbAuthService,  private fb: FormBuilder, private _authenticationService: AuthenticateService, private router: Router, private appComponent: AppComponent, private _BedrijfService: BedrijfService) 
  {
  this.FbAuthService.afAuth.user.subscribe(user => {
    console.log(user);
    })
   }
   
  loginForm: FormGroup;
  registerForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      Username: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
    })

   // this.getUserDetails();
  }

  authFB() {
    this.FbAuthService.facebookAuth();
  }

  enableRegister() {
    this.login = 2;
  }

  onEnableLogin(status: boolean) {
    this.login = 1;
  }

  enableForgotPassword() {
    this.login = 3;
  }

  onLogin() {
    this.submitted = true;
    this.invalid = false;
    this.invalidVerified = false;
    this._authenticationService.authenticate(this.loginForm.value).subscribe(result => {
      console.log("this");
      console.log(result)
      
      this._authenticationService.setToken(result.token);
      this._authenticationService.checkUser();
      this._authenticationService.userObject.next(result);
      this._authenticationService.setUserInfo();
      console.log(result);
      this.submitted = false;
    }, err => {
      console.log(err);
      if (err.error.message = "Username or password is incorrect") {
        if (err.error.text) {
          this.invalidVerified = true;
        } else {
        this.invalid = true;
        }
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

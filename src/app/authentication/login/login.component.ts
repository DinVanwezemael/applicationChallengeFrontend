import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login = true;
  submitted = false;
  invalid = false;

  constructor(private fb: FormBuilder, private _authenticationService: AuthenticateService, private router: Router) { }
  loginForm: FormGroup;
  registerForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      Username: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
    })
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

}

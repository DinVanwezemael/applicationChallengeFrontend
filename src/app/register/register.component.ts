import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { AuthenticateService } from '../authentication/services/authenticate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  login = true;
  submitted = false;

  constructor( private fb: FormBuilder, private _authenticationService: AuthenticateService) { }
  loginForm : FormGroup;
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

  disableRegister() {
    this.login = true;
  }

  onLogin() {
    console.log(this.loginForm.value);
    this._authenticationService.authenticate(this.loginForm.value).subscribe( result => {
      this._authenticationService.setToken(result.token);
      this._authenticationService.isLoggedin.next(true);
      console.log(result);
    }, err => {
      console.log(err);
    }
    );
  }

}

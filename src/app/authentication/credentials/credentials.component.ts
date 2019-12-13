import { Component, OnInit } from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import { AuthenticateService } from '../services/authenticate.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
  loginInfoForm: FormGroup;
  passwordForm: FormGroup;
  changePassword = false;
  submittedPassword = false;
  submittedUserInfo = false;
  waitUserInfo = false;
  waitPassword = false;
  passwordConfirm = false;
  userInfoConfirm = false;
  invalidUsername = false;
  invalidEmail = false;

  constructor(private fb: FormBuilder, private authenticateService: AuthenticateService) {
    this.loginInfoForm = this.fb.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    })

    this.passwordForm = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordHerhaald: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, {
      validator: MustMatch('password', 'passwordHerhaald')
    })
  }

  ngOnInit() {
    this.authenticateService.getLoginInfo().subscribe(result => {
      this.loginInfoForm.setValue({
        username: result.username,
        email: result.email,
      })
      console.log(result);
    });
  }

  get l() { return this.loginInfoForm.controls; }
  get p() { return this.passwordForm.controls; }

  changePasswordForm() {
    this.passwordForm.setValue({
      password: '',
      passwordHerhaald: ''
    })

    this.submittedPassword = false;
    this.passwordConfirm = false;

    $('#myModal').modal('show')
  }

  onSubmitPassword() {
    this.submittedPassword = true;
    this.waitPassword = true;

    var userLogin = {
      password: this.passwordForm.value.password
    }

    if (this.passwordForm.invalid) {
      this.waitPassword = false;
      return;
    }

    this.authenticateService.changePassword(0, userLogin).subscribe(result => {
      console.log(result);
      this.passwordConfirm = true;
    }, err => {
      console.log(err);
    })
    this.waitPassword = false;
  }

  onSubmitUserInfo() {
    this.submittedUserInfo = true;
    this.waitUserInfo = true;

    if (this.loginInfoForm.invalid) {
      this.waitUserInfo = false;
      return;
    }

    this.invalidUsername = false;
    this.invalidEmail = false;
    this.authenticateService.changeUserInfo(0, this.loginInfoForm.value).subscribe(result => {
      console.log(result);
      this.userInfoConfirm = true;
    }, err => {
      console.log(err);
      if (err.error.text == "Username") {
        this.invalidUsername = true;
      }

      if (err.error.text == "Email") {
        this.invalidEmail = true;
      }
    })


    this.waitUserInfo = false;
  }

}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}
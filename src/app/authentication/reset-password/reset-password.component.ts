import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  @Output() login = new EventEmitter<boolean>();
  submitted = false;
  wait = false;
  passwordConfirm = false;

  constructor(private fb: FormBuilder, private _authenticationService: AuthenticateService, private router: Router) { }
  ngOnInit() {
    this.passwordForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  disableRegister() {
    this.login.emit(true);
  }

  onSubmit() {
    this.submitted = true;
    this.wait = true;

    if (this.passwordForm.invalid) {
      this.wait = false;
      return;
    }

    this.passwordConfirm = true;

    this._authenticationService.resetPassword(this.passwordForm.value.email).subscribe(result => {
      console.log(result)
    }, err => {
      console.log(err.error)
    })

  }

  get p() { return this.passwordForm.controls; }

}

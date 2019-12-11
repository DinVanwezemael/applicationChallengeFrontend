import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { interval } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  constructor(private fb: FormBuilder) { }
  registerFormStudent: FormGroup;
  registerFormBedrijf: FormGroup;
  form: number;

  onSubmit() {
    console.log(this.registerFormStudent.value);
  }

  disableRegister() {
    this.login.emit(true);
  }

  ngOnInit() {
    this.registerFormStudent = this.fb.group({
      voornaam: new FormControl('', Validators.required),
      achternaam: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      wachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
      herhaalWachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })

    this.registerFormBedrijf = this.fb.group({
      voornaam: new FormControl('', Validators.required),
      achternaam: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      wachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
      herhaalWachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })

    this.form = 1;

    if (this.registerFormStudent.controls['wachtwoord'].value == this.registerFormStudent.controls['herhaalWachtwoord'].value) {

    }

    $(document).ready(function () {
      $('.carousel').carousel({
        touch: false,
        interval: false,
      })
    })
  }

  changeForm(nr: number) {
    this.form = nr;
    console.log(this.form);
  }

  registerStudentNext() {
    $('.carousel').carousel(1)
  }

}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { interval } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from '../services/authenticate.service';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  form: number;
  submitted = false;
  wait = false;

  constructor(private fb: FormBuilder, private parserFormatter: NgbDateParserFormatter, private authenticateService: AuthenticateService) { }
  registerFormStudent: FormGroup;
  registerFormBedrijf: FormGroup;

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
      email: new FormControl('', [Validators.required, Validators.email]),
      geboortedatum: new FormControl({}, Validators.required),
      straat: new FormControl('', Validators.required),
      nr: new FormControl('', Validators.required),
      stad: new FormControl('', Validators.required),
      postcode: new FormControl(null, Validators.required),
      biografie: new FormControl(''),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordHerhaald: new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
      {
        validator: MustMatch('password', 'passwordHerhaald')
      }
    )

    this.registerFormBedrijf = this.fb.group({
      voornaam: new FormControl('', Validators.required),
      achternaam: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      wachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
      herhaalWachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })

    this.form = 1;

    $(document).ready(function () {
      $('.carousel').carousel({
        touch: false,
        interval: false,
        wrap: false
      })
    })
  }

  changeForm(nr: number) {
    this.form = nr;
    console.log(this.form);
  }

  registerStudentNext() {
    $('.carousel').carousel(1)
    $('.carousel').carousel('pause');
  }

  registerStudentBack() {
    $('.carousel').carousel(0)
    $('.carousel').carousel('pause');
  }

  onSubmitStudent() {
    this.wait = true;
    this.submitted = true;

    if (this.registerFormStudent.invalid) {
      $('.carousel').carousel(0)
      $('.carousel').carousel('pause');
      this.wait = false;
      return;
    }

    //13/11/1998 00:00:00

    var datum = this.registerFormStudent.value.geboortedatum.day + '/' + 
                this.registerFormStudent.value.geboortedatum.month + '/' + 
                this.registerFormStudent.value.geboortedatum.year + ' 00:00:00'

    var maker = {
      voornaam: this.registerFormStudent.value.voornaam,
      achternaam: this.registerFormStudent.value.achternaam,
      biografie: this.registerFormStudent.value.biografie,
      geboorteDatum: datum,
      nr: this.registerFormStudent.value.nr,
      postcode: this.registerFormStudent.value.postcode,
      stad: this.registerFormStudent.value.stad,
      straat: this.registerFormStudent.value.straat,
    }

    var userLogin = {
      username: this.registerFormStudent.value.username,
      password: this.registerFormStudent.value.password,
      email: this.registerFormStudent.value.email,
    }

/*     this.authenticateService.addMaker(maker).subscribe(result => {
      console.log("yeet")
    },
    err => {
      console.log(err);
    }) */

    this.authenticateService.addMaker(maker, userLogin).subscribe(result => {
      console.log("yeet");
      console.log("result");
    },
    err => {
      console.log(err);
    })

    console.log(maker);
    console.log(userLogin);
    this.wait = false;
  }

  get f() { return this.registerFormStudent.controls; }

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

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { interval } from 'rxjs';
import { NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  form: number;
  submittedStudent = false;
  waitStudent = false;
  invalidStudentUsername = false;
  invalidStudentEmail = false;

  constructor(private appComponent: AppComponent, private router: Router, private fb: FormBuilder, private parserFormatter: NgbDateParserFormatter, private calendar: NgbCalendar, private authenticateService: AuthenticateService) { }
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
    this.waitStudent = true;
    this.submittedStudent = true;

    if (this.registerFormStudent.invalid) {
      $('.carousel').carousel(0)
      $('.carousel').carousel('pause');
      this.waitStudent = false;
      return;
    }

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

    var data = { maker, userLogin }

    this.invalidStudentUsername = false;
    this.invalidStudentEmail = false;

    this.authenticateService.addMaker(data).subscribe(result => {
      var login = {
        Username: userLogin.username,
        Password: userLogin.password
      }

      this.onLogin(login);
    },
      err => {
        if (err.error.text == "Username") {
          this.invalidStudentUsername = true;
        }

        if (err.error.text == "Email") {
          this.invalidStudentEmail = true;
          $('.carousel').carousel(0)
          $('.carousel').carousel('pause');
        }

        console.log(err);

      })

    console.log(maker);
    console.log(userLogin);
    this.waitStudent = false;
  }

  get f() { return this.registerFormStudent.controls; }

  onLogin(userlogin: any) {
    this.authenticateService.authenticate(userlogin).subscribe(result => {
      this.authenticateService.setToken(result.token);
      this.authenticateService.checkUser();
      console.log(result);

      localStorage.setItem("username", result.username);
      localStorage.setItem("naam", result.voornaam);
      localStorage.setItem("achternaam", result.achternaam);

      this.appComponent.username = result.username;
      this.appComponent.naam = result.naam;
      this.appComponent.achternaam = result.achternaam;

      switch (this.authenticateService.currentRole.value) {
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
    }, err => {
      console.log(err);
      alert("Er is iets verkeerd gegaan.")
      this.router.navigate(['login']);
    }
    );


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

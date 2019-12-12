import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/authentication/register/register.component';
import { NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maker-form',
  templateUrl: './maker-form.component.html',
  styleUrls: ['./maker-form.component.scss']
})
export class MakerFormComponent implements OnInit {
  submittedStudent = false;
  waitStudent = false;
  invalidStudentUsername = false;
  invalidStudentEmail = false;

  registerForm = this.fb.group({
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

  constructor(private fb: FormBuilder, private calendar: NgbCalendar, private authenticateService: AuthenticateService, private router: Router) { }

  ngOnInit() {
  }

  onSubmitStudent() {
    this.waitStudent = true;
    this.submittedStudent = true;

    if (this.registerForm.invalid) {
      this.waitStudent = false;
      return;
    }

    var datum = this.registerForm.value.geboortedatum.day + '/' +
      this.registerForm.value.geboortedatum.month + '/' +
      this.registerForm.value.geboortedatum.year + ' 00:00:00'

    var maker = {
      voornaam: this.registerForm.value.voornaam,
      achternaam: this.registerForm.value.achternaam,
      biografie: this.registerForm.value.biografie,
      geboorteDatum: datum,
      nr: this.registerForm.value.nr,
      postcode: this.registerForm.value.postcode,
      stad: this.registerForm.value.stad,
      straat: this.registerForm.value.straat,
    }

    var userLogin = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      email: this.registerForm.value.email,
    }

    var data = { maker, userLogin }

    this.invalidStudentUsername = false;
    this.invalidStudentEmail = false;

    this.authenticateService.addMaker(data).subscribe(result => {
      var login = {
        Username: userLogin.username,
        Password: userLogin.password
      }

      this.router.navigate(['adminHome'])
    },
      err => {
        if (err.error.text == "Username") {
          this.invalidStudentUsername = true;
        }

        if (err.error.text == "Email") {
          this.invalidStudentEmail = true;
        }

        console.log(err);

      })

    console.log(maker);
    console.log(userLogin);
    this.waitStudent = false;
  }

  get f() { return this.registerForm.controls; }
}

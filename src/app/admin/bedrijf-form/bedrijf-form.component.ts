import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { MustMatch } from 'src/app/authentication/register/register.component';

@Component({
  selector: 'app-bedrijf-form',
  templateUrl: './bedrijf-form.component.html',
  styleUrls: ['./bedrijf-form.component.scss']
})
export class BedrijfFormComponent implements OnInit {
  submittedBedrijf = false;
  waitBedrijf = false;
  invalidBedrijfUsername = false;
  invalidBedrijfEmail = false;
  invalidBedrijfNaam = false;

  registerFormBedrijf = this.fb.group({
    naam: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
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
    })

  constructor(private router: Router, private fb: FormBuilder, private authenticateService: AuthenticateService) { }

  ngOnInit() {
  }

  onSubmitBedrijf() {
    this.waitBedrijf = true;
    this.submittedBedrijf = true;

    if (this.registerFormBedrijf.invalid) {
      this.waitBedrijf = false;
      return;
    }

    var bedrijf = {
      naam: this.registerFormBedrijf.value.naam,
      biografie: this.registerFormBedrijf.value.biografie,
      nr: this.registerFormBedrijf.value.nr,
      postcode: this.registerFormBedrijf.value.postcode,
      stad: this.registerFormBedrijf.value.stad,
      straat: this.registerFormBedrijf.value.straat,
    }

    var userLogin = {
      username: this.registerFormBedrijf.value.username,
      password: this.registerFormBedrijf.value.password,
      email: this.registerFormBedrijf.value.email,
    }

    var data = { bedrijf, userLogin }

    this.invalidBedrijfUsername = false;
    this.invalidBedrijfEmail = false;
    this.invalidBedrijfNaam = false;

    this.authenticateService.addBedrijf(data).subscribe(result => {
      var login = {
        Username: userLogin.username,
        Password: userLogin.password
      }

      this.router.navigate(['adminHome'])
    },
      err => {
        if (err.error.text == "Username") {
          this.invalidBedrijfUsername = true;
        }

        if (err.error.text == "Email") {
          this.invalidBedrijfEmail = true;
        }

        if (err.error.text == "Name") {
          this.invalidBedrijfNaam = true;
        }

        console.log(err);

      })

    console.log(bedrijf);
    console.log(userLogin);
    this.waitBedrijf = false;
  }

  get b() { return this.registerFormBedrijf.controls; }
}

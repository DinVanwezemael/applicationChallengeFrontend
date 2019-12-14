import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { interval } from 'rxjs';
import { NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { TagObject } from 'src/app/models/tagObject.model';
import { TagInputModule } from 'ngx-chips';
import { ToastService } from 'src/app/toast-global/toast-service';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', './centtask-tags.scss']
})
export class RegisterComponent implements OnInit {
  @Output() login = new EventEmitter<boolean>();
  form: number;
  submittedStudent = false;
  waitStudent = false;
  invalidStudentUsername = false;
  invalidStudentEmail = false;
  tagsObject: TagObject[] = [];
  tagItems = [];

  submittedBedrijf = false;
  waitBedrijf = false;
  invalidBedrijfUsername = false;
  invalidBedrijfEmail = false;
  invalidBedrijfNaam = false;

  constructor(private toastSerivce: ToastService, private appComponent: AppComponent, private router: Router, private fb: FormBuilder, private parserFormatter: NgbDateParserFormatter, private calendar: NgbCalendar, private authenticateService: AuthenticateService) { }
  registerFormStudent: FormGroup;
  registerFormBedrijf: FormGroup;

  // MAIN FUNCTIONS & INIT
  disableRegister() {
    this.login.emit(true);
  }

  ngOnInit() {
    this.authenticateService.getTags().subscribe(result => {
      result.forEach(function (item) {
        this.tagItems.push(item.naam)
      }, this)
    });
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
      linkedInLink: new FormControl(''),
      ervaring: new FormControl(''),
      tags: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordHerhaald: new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
      {
        validator: MustMatch('password', 'passwordHerhaald')
      }
    )

    this.registerFormBedrijf = this.fb.group({
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

    this.form = 1;

    $(document).ready(function () {
      $('.carousel').carousel({
        touch: false,
        interval: false,
        wrap: false
      })
    },

      $('.carousel2').carousel({
        touch: false,
        interval: false,
        wrap: false
      }))
  }


  changeForm(nr: number) {
    this.form = nr;
    console.log(this.form);
  }

  onLogin(userlogin: any) {
    this.authenticateService.authenticate(userlogin).subscribe(result => {
      this.authenticateService.loginUser(result.token);
      this.authenticateService.userObject.next(result);
      this.authenticateService.checkUser();
    }, err => {
      console.log(err);
      alert("Er is iets verkeerd gegaan.")
      this.router.navigate(['login']);
    }
    );


  }

  registerNext() {
    $('.carousel').carousel(1)
    $('.carousel').carousel('pause');
  }

  registerBack() {
    $('.carousel').carousel(0)
    $('.carousel').carousel('pause');
  }

  // STUDENT FORM FUNCTIONS

  onSubmitStudent() {
    this.waitStudent = true;
    this.submittedStudent = true;

    if (this.registerFormStudent.invalid) {
      $('.carousel').carousel(0)
      $('.carousel').carousel('pause');
      this.waitStudent = false;
      return;
    }

    var datum = this.registerFormStudent.value.geboortedatum.month + '/' +
      this.registerFormStudent.value.geboortedatum.day + '/' +
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
      ervaring: this.registerFormStudent.value.ervaring,
      linkedInLink: this.registerFormStudent.value.linkedInLink,
    }

    var userLogin = {
      username: this.registerFormStudent.value.username,
      password: this.registerFormStudent.value.password,
      email: this.registerFormStudent.value.email,
    }

    var tags = []
    if (this.tagsObject.length != 0) {
      this.tagsObject.forEach(function (item) {
        console.log(item);
        tags.push(item.value)
      }, this)
    }

    console.log(tags);
    var data = { maker, userLogin, tags }


    this.invalidStudentUsername = false;
    this.invalidStudentEmail = false;

    this.authenticateService.addMaker(data).subscribe(result => {
      var login = {
        Username: userLogin.username,
        Password: userLogin.password
      }

      this.disableRegister();
      this.toastSerivce.show('Account gecreëerd! Gelieve eerst deze te bevestigen via de link in je mailbox.', { classname: 'bg-success text-light', delay: 10000 });
      this.waitStudent = false;
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
        this.waitStudent = false;
      })
  }

  get f() { return this.registerFormStudent.controls; }



  // BEDRIJF FORM FUNCTIONS

  onSubmitBedrijf() {
    this.waitBedrijf = true;
    this.submittedBedrijf = true;

    if (this.registerFormBedrijf.invalid) {
      $('.carousel').carousel(0)
      $('.carousel').carousel('pause');
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

      this.disableRegister();
      this.toastSerivce.show('Account gecreëerd! Gelieve eerst deze te bevestigen via de link in je mailbox.', { classname: 'bg-success text-light', delay: 10000 });
      this.waitBedrijf = false;
    },
      err => {
        if (err.error.text == "Username") {
          this.invalidBedrijfUsername = true;
        }

        if (err.error.text == "Email") {
          this.invalidBedrijfEmail = true;
          $('.carousel').carousel(0)
          $('.carousel').carousel('pause');
        }

        if (err.error.text == "Name") {
          this.invalidBedrijfNaam = true;
          $('.carousel').carousel(0)
          $('.carousel').carousel('pause');
        }

        this.waitBedrijf = false;
      })

  }

  get b() { return this.registerFormBedrijf.controls; }

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

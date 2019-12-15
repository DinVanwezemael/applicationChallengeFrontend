import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MustMatch } from 'src/app/authentication/register/register.component';
import { NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/toast-global/toast-service';
import { TagObject } from 'src/app/models/tagObject.model';
import { AdminService } from '../admin.service';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { UserLogin } from 'src/app/models/user-login.model';

@Component({
  selector: 'app-maker-form',
  templateUrl: './maker-form.component.html',
  styleUrls: ['./maker-form.component.scss', './centtask-tags.scss']
})
export class MakerFormComponent implements OnInit {
  submittedStudent = false;
  waitStudent = false;
  invalidStudentUsername = false;
  invalidStudentEmail = false;
  formStudent: FormGroup;
  tagsObject: TagObject[] = [];
  newMaker = false;
  tagItems = [];

  constructor(private _adminService: AdminService, private toastService: ToastService, private fb: FormBuilder, private calendar: NgbCalendar, private authenticateService: AuthenticateService, private router: Router) {
    this.formStudent = this.fb.group({
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
      password: new FormControl('', [Validators.required,Validators.minLength(6)]),
      passwordHerhaald: new FormControl('', [Validators.required,Validators.minLength(6)]),
    },
      {
        validator: MustMatch('password', 'passwordHerhaald')
      }
    )


  }

  ngOnInit() {
    var makerObject = this._adminService.maker.value;
    if (makerObject != null) {
      this.formStudent.get('password').setValidators([Validators.minLength(6)]);
      this.formStudent.get('passwordHerhaald').setValidators([Validators.minLength(6)]);
      this.tagsObject = [];

      if (makerObject.maker.interesses != null) {
        this.authenticateService.getTags().subscribe(result => {
          result.forEach(tag => {
            makerObject.maker.interesses.forEach(makerTag => {
              if (makerTag.selfSet == true) {
                if (tag.id == makerTag.tagId) {
                  this.tagsObject.push(new TagObject(tag.naam, tag.naam));
                }
              }
            });
          });
        });
      }

      let newDate = new Date(makerObject.maker.geboorteDatum);
      this.newMaker = false;
      this.formStudent.setValue({
        voornaam: makerObject.maker.voornaam,
        achternaam: makerObject.maker.achternaam,
        email: makerObject.email,
        geboortedatum: { year: newDate.getFullYear(), month: newDate.getMonth() + 1, day: newDate.getDate() },
        straat: makerObject.maker.straat,
        nr: makerObject.maker.nr,
        stad: makerObject.maker.stad,
        postcode: makerObject.maker.postcode,
        biografie: makerObject.maker.biografie,
        username: makerObject.username,
        linkedInLink: makerObject.maker.linkedInLink,
        ervaring: makerObject.maker.ervaring,
        tags: "",
        password: "",
        passwordHerhaald: "",
      });

    } else {
      this.newMaker = true;
      this.formStudent.get('password').setValidators([Validators.required,Validators.minLength(6)]);
      this.formStudent.get('passwordHerhaald').setValidators([Validators.required,Validators.minLength(6)]);
    }

  }

  onSubmitStudent() {
    if (this.newMaker == true) {
    this.waitStudent = true;
    this.submittedStudent = true;

    if (this.formStudent.invalid) {
      this.waitStudent = false;
      return;
    }

    var datum = this.formStudent.value.geboortedatum.month + '/' +
      this.formStudent.value.geboortedatum.day + '/' +
      this.formStudent.value.geboortedatum.year + ' 00:00:00'

    var maker = {
      id: null,
      voornaam: this.formStudent.value.voornaam,
      achternaam: this.formStudent.value.achternaam,
      biografie: this.formStudent.value.biografie,
      geboorteDatum: datum,
      nr: this.formStudent.value.nr,
      postcode: this.formStudent.value.postcode,
      stad: this.formStudent.value.stad,
      straat: this.formStudent.value.straat,
      ervaring: this.formStudent.value.ervaring,
      linkedInLink: this.formStudent.value.linkedInLink,
    }

    var userLogin = {
      id: null,
      username: this.formStudent.value.username,
      password: this.formStudent.value.password,
      email: this.formStudent.value.email,
      verified: true,
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

      this.toastService.show('Maker toegevoegd.', { classname: 'bg-success text-light', delay: 10000 });
      this.waitStudent = false;
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
        this.waitStudent = false;
      })





    } else {
      this.waitStudent = true;
      this.submittedStudent = true;
  
      if (this.formStudent.invalid) {
        this.waitStudent = false;
        return;
      }
  
      var datum = this.formStudent.value.geboortedatum.month + '/' +
        this.formStudent.value.geboortedatum.day + '/' +
        this.formStudent.value.geboortedatum.year + ' 00:00:00'
  
      var maker = {
        id: this._adminService.maker.value.maker.id,
        voornaam: this.formStudent.value.voornaam,
        achternaam: this.formStudent.value.achternaam,
        biografie: this.formStudent.value.biografie,
        geboorteDatum: datum,
        nr: this.formStudent.value.nr,
        postcode: this.formStudent.value.postcode,
        stad: this.formStudent.value.stad,
        straat: this.formStudent.value.straat,
        ervaring: this.formStudent.value.ervaring,
        linkedInLink: this.formStudent.value.linkedInLink,
      }
  
      var userLogin = {
        id: this._adminService.maker.value.id,
        username: this.formStudent.value.username,
        password: this.formStudent.value.password,
        email: this.formStudent.value.email,
        verified: true,
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
  
      this._adminService.editMaker(userLogin.id,data).subscribe(result => {
  
        this.toastService.show('Maker aangepast', { classname: 'bg-success text-light', delay: 10000 });
        this.waitStudent = false;
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
          this.waitStudent = false;
        })
    }
  }

  back() {
    this.router.navigate(['adminHome']);
  }

  get f() { return this.formStudent.controls; }

  removeMaker() {
    var userLoginId = this._adminService.maker.value.id;
    var makerId = this._adminService.maker.value.maker.id;
    this._adminService.deleteUserLogin(userLoginId).subscribe();
    this._adminService.deleteSkillMakerWhereMakerId(makerId).subscribe();
    this._adminService.deleteOpdrachtMakerWhereMakerId(makerId).subscribe();
    this._adminService.deleteReviewWhereMakerId(makerId).subscribe();
    this._adminService.deleteMakerTagWhereMakerId(makerId).subscribe();
    this._adminService.deleteMaker(makerId).subscribe();

    this.toastService.show('De maker is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });

    setTimeout(() => {
      this.router.navigate(['adminHome'])
    }, 100);
  }
}

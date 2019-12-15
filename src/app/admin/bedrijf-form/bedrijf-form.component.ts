import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { MustMatch } from 'src/app/authentication/register/register.component';
import { AdminService } from '../admin.service';
import { ToastService } from 'src/app/toast-global/toast-service';
import { TagObject } from 'src/app/models/tagObject.model';
import { BedrijfTagService } from 'src/app/services/bedrijf-tag.service';

@Component({
  selector: 'app-bedrijf-form',
  templateUrl: './bedrijf-form.component.html',
  styleUrls: ['./bedrijf-form.component.scss', './centtask-tags.scss']
})
export class BedrijfFormComponent implements OnInit {
  submittedBedrijf = false;
  waitBedrijf = false;
  invalidBedrijfUsername = false;
  invalidBedrijfEmail = false;
  invalidBedrijfNaam = false;
  newBedrijf = false;
  formBedrijf: FormGroup;
  tagsObject: TagObject[] = [];
  tagItems = [];

  constructor(    private _BedrijfTagService: BedrijfTagService, private _adminService: AdminService, private toastService: ToastService, private fb: FormBuilder, private authenticateService: AuthenticateService, private router: Router) {
    this.formBedrijf = this.fb.group({
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
      tags: ""
    },
      {
        validator: MustMatch('password', 'passwordHerhaald')
      })


  }

  ngOnInit() {
    var bedrijfObject = this._adminService.bedrijf.value;
    if (bedrijfObject != null) {
      this.formBedrijf.get('password').setValidators([Validators.minLength(6)]);
      this.formBedrijf.get('passwordHerhaald').setValidators([Validators.minLength(6)]);

      if (bedrijfObject.bedrijf.tags != null) {
        this.authenticateService.getTags().subscribe(result => {
          result.forEach(tag => {
            bedrijfObject.bedrijf.tags.forEach(bedrijfTag => {
                if (tag.id == bedrijfTag.tagId) {
                  this.tagsObject.push(new TagObject(tag.naam, tag.naam));
                }
            });
          });
        });
      }


      this.newBedrijf = false;
      this.formBedrijf.setValue({
        naam: bedrijfObject.bedrijf.naam,
        email: bedrijfObject.email,
        straat: bedrijfObject.bedrijf.straat,
        nr: bedrijfObject.bedrijf.nr,
        stad: bedrijfObject.bedrijf.stad,
        postcode: bedrijfObject.bedrijf.postcode,
        biografie: bedrijfObject.bedrijf.biografie,
        username: bedrijfObject.username,
        password: "",
        passwordHerhaald: "",
        tags: ""
      });

    } else {
      this.newBedrijf = true;
      this.formBedrijf.get('password').setValidators([Validators.required, Validators.minLength(6)]);
      this.formBedrijf.get('passwordHerhaald').setValidators([Validators.required, Validators.minLength(6)]);
    }

  }

  onSubmitBedrijf() {
    if (this.newBedrijf == true) {
      this.waitBedrijf = true;
      this.submittedBedrijf = true;

      if (this.formBedrijf.invalid) {
        this.waitBedrijf = false;
        return;
      }

      var bedrijf = {
        id: 0,
        naam: this.formBedrijf.value.naam,
        biografie: this.formBedrijf.value.biografie,
        nr: this.formBedrijf.value.nr,
        postcode: this.formBedrijf.value.postcode,
        stad: this.formBedrijf.value.stad,
        straat: this.formBedrijf.value.straat,
      }

      var userLogin = {
        id: 0,
        username: this.formBedrijf.value.username,
        password: this.formBedrijf.value.password,
        email: this.formBedrijf.value.email,
        verified: true,
      }

      var tags = []
      if (this.tagsObject.length != 0) {
        this.tagsObject.forEach(function (item) {
          console.log(item);
          tags.push(item.value)
        }, this)
      }

      var data = { bedrijf, userLogin, tags }


      this.invalidBedrijfUsername = false;
      this.invalidBedrijfEmail = false;

      this.authenticateService.addBedrijf(data).subscribe(result => {

        this.toastService.show('Bedrijf toegevoegd.', { classname: 'bg-success text-light', delay: 10000 });
        this.waitBedrijf = false;
        this.router.navigate(['adminHome'])
      },
        err => {
          if (err.error.text == "Username") {
            this.invalidBedrijfUsername = true;
          }

          if (err.error.text == "Email") {
            this.invalidBedrijfEmail = true;
          }

          console.log(err);
          this.waitBedrijf = false;
        })





    } else {
      this.waitBedrijf = true;
      this.submittedBedrijf = true;

      if (this.formBedrijf.invalid) {
        this.waitBedrijf = false;
        return;
      }

      var bedrijf = {
        id: +this._adminService.bedrijf.value.bedrijf.id,
        naam: this.formBedrijf.value.naam,
        biografie: this.formBedrijf.value.biografie,
        nr: this.formBedrijf.value.nr,
        postcode: this.formBedrijf.value.postcode,
        stad: this.formBedrijf.value.stad,
        straat: this.formBedrijf.value.straat,
      }

      var userLogin = {
        id: +this._adminService.bedrijf.value.id,
        username: this.formBedrijf.value.username,
        password: this.formBedrijf.value.password,
        email: this.formBedrijf.value.email,
        verified: true,
      }

      var tags = []
      if (this.tagsObject.length != 0) {
        this.tagsObject.forEach(function (item) {
          console.log(item);
          tags.push(item.value)
        }, this)
      }

      var data = { bedrijf, userLogin, tags}

      this.invalidBedrijfUsername = false;
      this.invalidBedrijfEmail = false;

      this._adminService.editBedrijf(userLogin.id, data).subscribe(result => {

        this.toastService.show('Bedrijf aangepast', { classname: 'bg-success text-light', delay: 10000 });
        this.waitBedrijf = false;
        this.router.navigate(['adminHome'])
      },
        err => {
          if (err.error.text == "Username") {
            this.invalidBedrijfUsername = true;
          }

          if (err.error.text == "Email") {
            this.invalidBedrijfEmail = true;
          }

          console.log(err);
          this.waitBedrijf = false;
        })
    }
  }

  back() {
    this.router.navigate(['adminHome']);
  }

  get b() { return this.formBedrijf.controls; }

  removeBedrijf() {
    var userLoginId = this._adminService.bedrijf.value.id;
    var bedrijfId = this._adminService.bedrijf.value.bedrijf.id;

    this._adminService.deleteUserLogin(userLoginId).subscribe();
    this._adminService.deleteBedrijf(bedrijfId).subscribe();
    this._BedrijfTagService.deleteAllWhereBedrijfId(bedrijfId).subscribe();
    this._adminService.deleteReviewWhereBedrijfId(bedrijfId).subscribe();
    

    this.toastService.show('Het bedrijf is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });

    setTimeout(() => {
      this.router.navigate(['adminHome'])
    }, 100);
  }
}

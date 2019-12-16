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
  selector: 'app-opdracht-form',
  templateUrl: './opdracht-form.component.html',
  styleUrls: ['./opdracht-form.component.scss', './centtask-tags.scss']
})
export class OpdrachtFormComponent implements OnInit {

  submittedOpdracht = false;
  waitOpdracht = false;
  newOpdracht = false;
  formOpdracht: FormGroup;
  tagsObject: TagObject[] = [];
  tagItems = [];
  bedrijf = "";

  constructor(private _adminService: AdminService, private toastService: ToastService, private fb: FormBuilder, private authenticateService: AuthenticateService, private router: Router) {
    this.formOpdracht = this.fb.group({
      titel: new FormControl('', Validators.required),
      omschrijving: new FormControl('', Validators.required),
      straat: new FormControl('', Validators.required),
      nr: new FormControl('', Validators.required),
      stad: new FormControl('', Validators.required),
      postcode: new FormControl(null, Validators.required),
      tags: ""
    })
  }

  ngOnInit() {
    var OpdrachtObject = this._adminService.opdracht.value;
    if (OpdrachtObject != null) {
      this.bedrijf = OpdrachtObject.bedrijf.naam

      if (OpdrachtObject.tags != null) {
        this.authenticateService.getTags().subscribe(result => {
          result.forEach(tag => {
            OpdrachtObject.tags.forEach(OpdrachtTag => {
              if (tag.id == OpdrachtTag.tagId) {
                this.tagsObject.push(new TagObject(tag.naam, tag.naam));
              }
            });
          });
        });
      }
    }

    this.formOpdracht.setValue({
      titel: OpdrachtObject.titel,
      omschrijving: OpdrachtObject.omschrijving,
      straat: OpdrachtObject.straat,
      nr: OpdrachtObject.straatNr,
      stad: OpdrachtObject.woonPlaats,
      postcode: OpdrachtObject.postcode,
      tags: ""
    });
  }

  onSubmitOpdracht() {
    this.waitOpdracht = true;
    this.submittedOpdracht = true;

    if (this.formOpdracht.invalid) {
      this.waitOpdracht = false;
      return;
    }

    var opdracht = {
      id: +this._adminService.opdracht.value.id,
      titel: this.formOpdracht.value.titel,
      omschrijving: this.formOpdracht.value.omschrijving,
      straatNr: this.formOpdracht.value.nr,
      postcode: this.formOpdracht.value.postcode,
      woonPlaats: this.formOpdracht.value.stad,
      straat: this.formOpdracht.value.straat,
    }

    var tags = []
    if (this.tagsObject.length != 0) {
      this.tagsObject.forEach(function (item) {
        console.log(item);
        tags.push(item.value)
      }, this)
    }

    var data = { opdracht, tags }

    this._adminService.editOpdracht(opdracht.id, data).subscribe(result => {

      this.toastService.show('Opdracht aangepast', { classname: 'bg-success text-light', delay: 10000 });
      this.waitOpdracht = false;
      this.router.navigate(['adminHome'])
    },
      err => {
        console.log(err);
        this.waitOpdracht = false;
      })

  }

  back() {
    this.router.navigate(['adminHome']);
  }

  get o() { return this.formOpdracht.controls; }

  removeOpdracht() {
    var OpdrachtId = this._adminService.opdracht.value.id;

    this._adminService.deleteOpdracht(OpdrachtId).subscribe();


    this.toastService.show('Opdracht is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });

    setTimeout(() => {
      this.router.navigate(['adminHome'])
    }, 100);
  }
}

import { Component, OnInit } from '@angular/core';
import { Opdracht } from '../models/opdracht.model';
import { OpdrachtService } from '../services/opdracht.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { fakeAsync } from '@angular/core/testing';
import { OpdrachtTagService } from '../services/opdracht-tag.service';
import { OpdrachtTag } from '../models/opdrachtTag.model';
import { Tag } from '../models/tag.model';
import { TagObject } from '../models/tagObject.model';
import { TagService } from '../services/tag.service';
import { OpdrachtMakerService } from '../services/opdracht-maker.service';
import { removeSummaryDuplicates } from '@angular/compiler';
import { OpdrachtMaker } from '../models/opdracht-maker.model';
import { Maker } from '../models/maker.model';
import { AuthenticateService } from '../authentication/services/authenticate.service';

@Component({
  selector: 'app-opdracht-detail',
  templateUrl: './opdracht-detail.component.html',
  styleUrls: ['./opdracht-detail.component.scss']
})
export class OpdrachtDetailComponent implements OnInit {
  Opdracht: Opdracht = new Opdracht(0, "", "", null, "", "", "", "", null, null, true, false, null);
  editOpdracht = false;
  newOpdracht = false;
  opdrachtForm: FormGroup;
  newOpdrachtForm: FormGroup;
  opdrachtTags: OpdrachtTag[];
  tags: TagObject[];
  bedrijfId: number;
  opdrachtmakers;
  tagItems = [];
  newOpdrachtId;
  submittedOpdracht = false;
  waitOpdracht = false;
  submittedOpdrachtNew = false;
  waitOpdrachtNew = false;
  constructor(private _OpdrachtService: OpdrachtService, private _OpdrachtMakerService: OpdrachtMakerService, private _TagService: TagService, private _OpdrachtTagService: OpdrachtTagService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private authenticateService: AuthenticateService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.opdrachtId != null) {
          this.newOpdracht = false;
          this._OpdrachtService.getWhereId(params.opdrachtId).subscribe(result => {
            this.Opdracht = result;
            this._OpdrachtMakerService.getDeelnameWhereOpdrachtId(result.id).subscribe(result => {
              console.log(result)
              this.opdrachtmakers = result;
            })
            this._OpdrachtTagService.getWhereBedrijfId(this.Opdracht.id).subscribe(result => {
              this.opdrachtTags = result;
              var tagHelper: Array<TagObject> = [];
              result.forEach(opdrachtTag => {
                var tagObject = new TagObject(opdrachtTag.tag.naam, opdrachtTag.tag.id);
                tagHelper.push(tagObject)
              });
              this.tags = tagHelper;
            })
          });

        } else {
          this.bedrijfId = params.bedrijfId;
          this.newOpdracht = true;
          this.editOpdracht = true;
          this.Opdracht = new Opdracht(0, "", "", params.bedrijfId, "", "", "", "", null, null, true, false, null);
        }

      });
    this.opdrachtForm = this.fb.group({
      Titel: new FormControl('', Validators.required),
      Omschrijving: new FormControl('', Validators.required),
      Postcode: new FormControl('', Validators.required),
      Woonplaats: new FormControl('', Validators.required),
      Straat: new FormControl('', Validators.required),
      StraatNr: new FormControl('', Validators.required),
      Id: new FormControl('', Validators.required),
      BedrijfId: new FormControl('', Validators.required),
      Tags: new FormControl(''),
      Open: new FormControl('', Validators.required)
    })
    this.newOpdrachtForm = this.fb.group({
      Titel: new FormControl('', Validators.required),
      Omschrijving: new FormControl('', Validators.required),
      Postcode: new FormControl('', Validators.required),
      Woonplaats: new FormControl('', Validators.required),
      Straat: new FormControl('', Validators.required),
      StraatNr: new FormControl('', Validators.required),
      Id: new FormControl('', Validators.required),
      BedrijfId: new FormControl('', Validators.required),
      Tags: new FormControl(''),
      Open: new FormControl('', Validators.required)
    })

    this.authenticateService.getTags().subscribe(result => {
      result.forEach(function (item) {
        this.tagItems.push(new TagObject(item.naam, item.id))
      }, this)
    });
  }
  AccepteerMaker(id: number, oldOpdrachtMaker: OpdrachtMaker) {
    const opdrachtMaker = oldOpdrachtMaker;
    opdrachtMaker.geaccepteerd = true;
    this._OpdrachtMakerService.accepteerDeelname(id, opdrachtMaker).subscribe(result => {

    })
  }
  EindigOpdracht() {
    const opdracht: Opdracht = this.Opdracht;
    opdracht.open = false;
    opdracht.klaar = true;
    this._OpdrachtService.editOpdracht(opdracht.id, opdracht).subscribe(
      result => {
      });
  }
  viewMaker(id: number) {
    this.router.navigate(['opdracht-maker'], { queryParams: { makerId: id } })
  }
  SluitOpdracht() {
    const opdracht: Opdracht = this.Opdracht;
    opdracht.open = false;
    this._OpdrachtService.editOpdracht(opdracht.id, opdracht).subscribe(
      result => {
      }
    );
  }
  OpenOpdracht() {
    const opdracht: Opdracht = this.Opdracht;
    opdracht.open = true;
    this._OpdrachtService.editOpdracht(opdracht.id, opdracht).subscribe(
      result => {
      }
    );
  }
  VerwijderMaker(id: number) {
    this._OpdrachtMakerService.deleteDeelname(id).subscribe(result => {
      this._OpdrachtMakerService.getDeelnameWhereOpdrachtId(this.Opdracht.id).subscribe(result => {
        this.opdrachtmakers = result;
      })
    })
  }
  editOpdrachtDetails() {
    if (this.editOpdracht == true) {
      this.editOpdracht = false;
    }
    else {
      this.editOpdracht = true;
    }
  }
  deleteOpdracht(id) {
    this._OpdrachtService.deleteOpdracht(id).subscribe(
      result => {
        this.router.navigate(["bedrijfOpdrachten"]);
      }
    );
  }
  get o() { return this.opdrachtForm.controls; }
  get no() { return this.newOpdrachtForm.controls; }

  saveChangesOpdracht() {
    this.submittedOpdracht = true;
    this.waitOpdracht = true;
    if (this.opdrachtForm.invalid) {
      this.waitOpdracht = false;
      return;
    }

    var tag = this.opdrachtForm.controls[('Tags')].value;


    this._OpdrachtTagService.deleteAllWhereBedrijfId(this.opdrachtForm.controls[('Id')].value).subscribe(
      result => {
        tag.forEach(tag => {
          console.log(tag.display + " " + tag.value);
          var naamt = tag.display;
          if (tag.value == tag.display) {

            let tag: Tag = {
              naam: naamt,
              id: 0
            }

            this._TagService.newTag(tag).subscribe(
              result => {

                let tagOpdracht: OpdrachtTag = new OpdrachtTag(0, this.opdrachtForm.controls[('Id')].value, result.id, null, null)
                this._OpdrachtTagService.newOpdrachtTag(tagOpdracht).subscribe();
              }
            );
          }
          else {
            let tagOpdracht: OpdrachtTag = new OpdrachtTag(0, this.opdrachtForm.controls[('Id')].value, tag.value, null, null)

            this._OpdrachtTagService.newOpdrachtTag(tagOpdracht).subscribe();
          }

          this.editOpdracht = false;


        });
      }
    );





    this._OpdrachtService.editOpdracht(this.opdrachtForm.controls['Id'].value, this.opdrachtForm.value).subscribe(
      result => {
        this.editOpdracht = false;
        this.waitOpdracht = false;
      },
      err => {
        alert("opdracht bestaat al")
      }
    );
  }
  postOpdracht() {
    this.submittedOpdrachtNew = true;
    this.waitOpdrachtNew = true;
    if (this.newOpdrachtForm.invalid) {
      this.waitOpdrachtNew = false;
      return;
    }
    console.log(this.newOpdrachtForm.value);
    console.log(this.tags)

    this.newOpdrachtForm.controls['Open'].setValue(true);

    this._OpdrachtService.newOpdracht(this.newOpdrachtForm.value).subscribe(
      result => {

        this.newOpdrachtId = result.id;
        console.log(this.newOpdrachtId);
        console.log(this.newOpdrachtForm.controls[('Tags')].value);

        var tag = this.newOpdrachtForm.controls[('Tags')].value;


        if (tag != null) {
        tag.forEach(tag => {
          console.log(tag.display + " " + tag.value);
          var naamt = tag.display;
          if (tag.value == tag.display) {

            let tag: Tag = {
              naam: naamt,
              id: 0
            }

            this._TagService.newTag(tag).subscribe(
              result => {

                let tagOpdracht: OpdrachtTag = new OpdrachtTag(0, this.newOpdrachtId, result.id, null, null)
                this._OpdrachtTagService.newOpdrachtTag(tagOpdracht).subscribe();
              }
            );
          }
          else {

            let tagOpdracht: OpdrachtTag = new OpdrachtTag(0, this.newOpdrachtId, tag.value, null, null)
            console.log(tagOpdracht);


            this._OpdrachtTagService.newOpdrachtTag(tagOpdracht).subscribe(
              result => {
                console.log(result);
              }
            );
          }

          this.editOpdracht = false;


        });
      }


        this.waitOpdrachtNew = false;
        this.router.navigate(["bedrijfOpdrachten"]);
      },
      err => {
        alert("opdracht bestaat al")
      }
    );
  }
}

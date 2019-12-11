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

@Component({
  selector: 'app-opdracht-detail',
  templateUrl: './opdracht-detail.component.html',
  styleUrls: ['./opdracht-detail.component.scss']
})
export class OpdrachtDetailComponent implements OnInit {
  Opdracht: Opdracht;
  editOpdracht = false;
  newOpdracht = false;
  opdrachtForm: FormGroup;
  opdrachtTags: OpdrachtTag[];
  tags: TagObject[];
  bedrijfId: number;
  constructor(private _OpdrachtService: OpdrachtService, private _TagService: TagService, private _OpdrachtTagService: OpdrachtTagService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.opdrachtId != null) {
          this.newOpdracht = false;
          this._OpdrachtService.getWhereId(params.opdrachtId).subscribe(result => {
            this.Opdracht = result;
            this._OpdrachtTagService.getWhereBedrijfId(this.Opdracht.id).subscribe(result => {
              this.opdrachtTags = result;
              var tagHelper: Array<TagObject> = [];
              result.forEach(opdrachtTag => {
                var tagObject = new TagObject(opdrachtTag.tag.naam, opdrachtTag.tag.naam);
                tagHelper.push(tagObject)
              });
              this.tags = tagHelper;
            })
          });

        } else {
          this.bedrijfId = params.bedrijfId;
          this.newOpdracht = true;
          this.editOpdracht = true;
        }

      });
    this.opdrachtForm = this.fb.group({
      Titel: new FormControl('', Validators.required),
      Omschrijving: new FormControl('', Validators.required),
      Locatie: new FormControl('', Validators.required),
      Id: new FormControl('', Validators.required),
      BedrijfId: new FormControl('', Validators.required),
      Tags: new FormControl('', Validators.required)
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
  saveChangesOpdracht() {
    this._OpdrachtTagService.deleteAllWhereBedrijfId(this.Opdracht.bedrijfId).subscribe(result => {
      this.tags.forEach(tag => {
        var newTag = new Tag(0, tag.value);
        this._TagService.newTag(newTag).subscribe(result => {
          console.log("tag upload")
          var opdrachtTag = new OpdrachtTag(0, this.Opdracht.id, result.id, null, null)
          this._OpdrachtTagService.newOpdrachtTag(opdrachtTag).subscribe(result => {
            this._OpdrachtTagService.getWhereBedrijfId(this.Opdracht.id).subscribe(result => {

              console.log(result)
            })
          })
        })
      });
    })
    this._OpdrachtService.editOpdracht(this.opdrachtForm.controls['Id'].value, this.opdrachtForm.value).subscribe(
      result => {
        console.log("editOpdracht werkt")
        this.editOpdracht = false;

      },
      err => {
        alert("opdracht bestaat al")
      }
    );
  }

}

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
  newOpdrachtForm: FormGroup;
  opdrachtTags: OpdrachtTag[];
  tags: TagObject[];
  bedrijfId: number;
  opdrachtmakers;
  constructor(private _OpdrachtService: OpdrachtService,private _OpdrachtMakerService:OpdrachtMakerService, private _TagService: TagService, private _OpdrachtTagService: OpdrachtTagService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.opdrachtId != null) {
          this.newOpdracht = false;
          this._OpdrachtService.getWhereId(params.opdrachtId).subscribe(result => {
            this.Opdracht = result;
            this._OpdrachtMakerService.getDeelnameWhereOpdrachtId(result.id).subscribe(result=>{
              console.log(result)
              this.opdrachtmakers=result;
            })
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
          this.Opdracht= new Opdracht(0,"","",params.bedrijfId,"","","","",null,null,false);
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
      Tags: new FormControl('', Validators.required),
      Open:new FormControl('',Validators.required)
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
      Tags: new FormControl('', Validators.required),
      Open:new FormControl('',Validators.required)
    })
  }
  AccepteerMaker(id:number,oldOpdrachtMaker:OpdrachtMaker){
    const opdrachtMaker= oldOpdrachtMaker;
    opdrachtMaker.geaccepteerd= true;
this._OpdrachtMakerService.accepteerDeelname(id,opdrachtMaker).subscribe(result=>{
  const opdracht:Opdracht = this.Opdracht;
  opdracht.open=false;
  console.log(opdracht)
  this._OpdrachtService.editOpdracht(opdracht.id, opdracht).subscribe(
    result => {
    },
    err => {
      alert("opdracht bestaat al")
    }
  );  
})
  }
  VerwijderMaker(id:number){
    this._OpdrachtMakerService.deleteDeelname(id).subscribe(result=>{
      this._OpdrachtMakerService.getDeelnameWhereOpdrachtId(this.Opdracht.id).subscribe(result=>{
        this.opdrachtmakers=result;
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
  saveChangesOpdracht() {
    this._OpdrachtTagService.deleteAllWhereBedrijfId(this.Opdracht.bedrijfId).subscribe(result => {
      this.tags.forEach(tag => {
        var newTag = new Tag(0, tag.value);
        this._TagService.newTag(newTag).subscribe(result => {
          var opdrachtTag = new OpdrachtTag(0, this.Opdracht.id, result.id, null, null)
          this._OpdrachtTagService.newOpdrachtTag(opdrachtTag).subscribe(result => {
            this._OpdrachtTagService.getWhereBedrijfId(this.Opdracht.id).subscribe(result => {}
            )
          })
        })
      });
    })
    this._OpdrachtService.editOpdracht(this.opdrachtForm.controls['Id'].value, this.opdrachtForm.value).subscribe(
      result => {
        this.editOpdracht = false;

      },
      err => {
        alert("opdracht bestaat al")
      }
    );
  }
  postOpdracht(){
    console.log(this.newOpdrachtForm.value);
    console.log(this.tags)
    this._OpdrachtService.newOpdracht(this.newOpdrachtForm.value).subscribe(
      result => {
        this.Opdracht = result;
          this.tags.forEach(tag => {
            var newTag = new Tag(0, tag.value);
            this._TagService.newTag(newTag).subscribe(result => {
              var opdrachtTag = new OpdrachtTag(0, this.Opdracht.id, result.id, null, null)
              this._OpdrachtTagService.newOpdrachtTag(opdrachtTag).subscribe(result => {
                this._OpdrachtTagService.getWhereBedrijfId(this.Opdracht.id).subscribe(result => {
                })
              })
            })
          });
          this.router.navigate(["bedrijfOpdrachten"]);
      },
      err => {
        alert("opdracht bestaat al")
      }
    );
  }
}

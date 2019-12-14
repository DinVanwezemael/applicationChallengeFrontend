import { Component, OnInit } from '@angular/core';
import { MakerService } from 'src/app/services/maker.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';
import * as jwtDecode from 'jwt-decode';
import { BedrijfService } from 'src/app/services/bedrijf.service';
import { TagObject } from 'src/app/models/tagObject.model';
import { BedrijfTag } from 'src/app/models/bedrijfTag.model';
import { BedrijfTagService } from 'src/app/services/bedrijf-tag.service';
import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-bedrijf',
  templateUrl: './bedrijf.component.html',
  styleUrls: ['./bedrijf.component.scss']
})
export class BedrijfComponent implements OnInit {

  constructor(private _BedrijfService: BedrijfService,private _BedrijfTagService:BedrijfTagService,private _TagService:TagService, private fb: FormBuilder, private authenticateService: AuthenticateService) { }

  bedrijf: Bedrijf;
  profielfoto
  username
  editBedrijf
  UserLoginId
  bedrijfTags: BedrijfTag[];
  tags: TagObject[];

  bedrijfForm = this.fb.group({
    Naam: new FormControl('', Validators.required),
    Postcode: new FormControl('', Validators.required),
    Stad: new FormControl('', Validators.required),
    Straat: new FormControl('', Validators.required),
    Nr: new FormControl('', Validators.required),
    Biografie: new FormControl('', Validators.required),
    Foto: new FormControl('', Validators.required),
    Tags: new FormControl('', Validators.required),
    Id: new FormControl('', Validators.required)
  })

  editUserDetails(){
    if(this.editBedrijf == true){
      this.editBedrijf = false;
    }
    else{
      this.editBedrijf = true;
    }
  }

  saveChangesBedrijf(){

    this._BedrijfService.updateBedrijf(this.bedrijfForm.controls['Id'].value , this.bedrijfForm.value).subscribe(
      result => {
        this._BedrijfTagService.deleteAllWhereBedrijfId(this.bedrijf.id).subscribe(result => {
          this.tags.forEach(tag => {
            var newTag = new Tag(0, tag.display);
            this._TagService.newTag(newTag).subscribe(result => {
              var opdrachtTag = new BedrijfTag(0, this.bedrijf.id, result.id, null, null)
              this.editBedrijf = false;
              this._BedrijfTagService.newBedrijfTag(opdrachtTag).subscribe(result => {
                this._BedrijfTagService.getWhereBedrijfId(this.bedrijf.id).subscribe(result => {
                })
              })
            })
          });
        })
        
      },
      err => {
        alert("username bestaat al");
      }
    )
  }


  haalMakerOp(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.UserLoginId = tokenPayload.UserLoginId;
    if(tokenPayload.role = "Bedrijf"){
      this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.bedrijf = result;
        console.log(result);
        this.profielfoto = "https://localhost:44341/images/"+this.bedrijf.foto;
        this._BedrijfTagService.getWhereBedrijfId(this.bedrijf.id).subscribe(result => {
          this.bedrijfTags = result;
          var tagHelper: Array<TagObject> = [];
          result.forEach(bedrijfTag => {
            console.log(bedrijfTag);
            var tagObject = new TagObject(bedrijfTag.tag.naam, bedrijfTag.tag.id);
            tagHelper.push(tagObject)
          });
          this.tags = tagHelper;
          console.log(this.tags);
        })
      });
    }
  } 

  getUsername(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    console.log(tokenPayload.Username);
    this.username = tokenPayload.Username;
  }

  ngOnInit() {
    this.haalMakerOp();
    this.getUsername();
  }

}

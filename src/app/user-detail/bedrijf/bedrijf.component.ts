import { Component, OnInit } from '@angular/core';
import { MakerService } from 'src/app/services/maker.service';
import * as jwtDecode from 'jwt-decode';
import { Maker } from 'src/app/models/maker.model';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { User } from 'src/app/authentication/models/user.model';
import { UserLogin } from 'src/app/models/user-login.model';
import { ToastService } from 'src/app/toast-global/toast-service';
import { MakerTag } from 'src/app/models/maker-tag.model';
import { TagObject } from 'src/app/models/tagObject.model';
import { MakerTagService } from 'src/app/services/maker-tag.service';
import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag.service';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { BedrijfService } from 'src/app/services/bedrijf.service';
import { BedrijfTagService } from 'src/app/services/bedrijf-tag.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';
import { BedrijfTag } from 'src/app/models/bedrijfTag.model';

@Component({
  selector: 'app-bedrijf',
  templateUrl: './bedrijf.component.html',
  styleUrls: ['./bedrijf.component.scss']
})
export class BedrijfComponent implements OnInit {

  constructor(private _BedrijfService: BedrijfService, private fb: FormBuilder, private authenticateService: AuthenticateService, private _authenticationService: AuthenticateService, private toastService: ToastService, private _BedrijfTagService: BedrijfTagService, private _TagService: TagService) { 
    
  }

  bedrijf:Bedrijf;
  profielfoto
  username
  editBedrijf
  UserLoginId
  userInfo;
  bedrijfTags: BedrijfTag[];
  tags: TagObject[];
  bedrijfid;
  tagItems = [];
  date

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

    console.log(this.bedrijfForm.controls[('Tags')].value);

    var tag = this.bedrijfForm.controls[('Tags')].value;

    this._BedrijfService.updateBedrijf(this.bedrijfForm.controls['Id'].value , this.bedrijfForm.value).subscribe(
      result => {
      },
      err => {
        alert("username bestaat al");
      }
    )
  

    this._BedrijfTagService.deleteAllWhereBedrijfId(this.bedrijfid).subscribe(
      result => {
        tag.forEach(tag => {
          console.log(tag.display + " " + tag.value);
          var naamt = tag.display;
          if(tag.value == tag.display){
            
            let tag: Tag = {
              naam : naamt,
              id: 0
            }

            this._TagService.newTag(tag).subscribe(
              result => {

                let tagBedrijf: BedrijfTag = new BedrijfTag(0,this.bedrijfid,result.id,null,null)
                this._BedrijfTagService.newBedrijfTag(tagBedrijf).subscribe();
              }
            );
          }
          else{
            let tagBedrijf: BedrijfTag = new BedrijfTag(0,this.bedrijfid,tag.value,null,null)

            this._BedrijfTagService.newBedrijfTag(tagBedrijf).subscribe();
          }

          this.haalBedrijfOp();
          this.editBedrijf = false;
          console.log("username is aangepast")
          
          
        });
      }
    );

    this.toastService.show('Je gegevens zijn aangepast!', { classname: 'bg-success text-light', delay: 10000 });
  }


  haalBedrijfOp(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.UserLoginId = tokenPayload.UserLoginId;
    this.username = tokenPayload.Username;
    if(tokenPayload.role = "Bedrijf"){
      this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.bedrijf = result;
        this.bedrijfid = result.id;
        this._BedrijfTagService.getWhereBedrijfId(result.id).subscribe(result => {
          this.bedrijfTags = result;
          console.log(result);
          var tagHelper: Array<TagObject> = [];
          result.forEach(bedrijfTag => {
            var tagObject = new TagObject(bedrijfTag.tag.naam, bedrijfTag.tag.id);
            tagHelper.push(tagObject)
          });
          this.tags = tagHelper;
          console.log(this.tags);
        });


        if(result.foto == null){
          this.profielfoto = "https://api.adorable.io/avatars/285/" + result.id + "@adorable.png";
        }
        else{
          this.profielfoto = "https://localhost:44341/images/"+this.bedrijf.foto;
        }
      });

      this._authenticationService.userObject.subscribe(result => {
        this.userInfo = result;
      }) 

      

    }
  } 

  getUsername(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.username = tokenPayload.Username;
  }

  ngOnInit() {

    this.authenticateService.getTags().subscribe(result => {
      result.forEach(function(item) {
        this.tagItems.push(new TagObject(item.naam, item.id))
      }, this)
    });


    this.haalBedrijfOp();
    this.getUsername();
  }

 

}

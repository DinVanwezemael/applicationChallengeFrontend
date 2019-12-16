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

@Component({
  selector: 'app-maker',
  templateUrl: './maker.component.html',
  styleUrls: ['./maker.component.scss']
})
export class MakerComponent implements OnInit {

  constructor(private _MakerService: MakerService, private fb: FormBuilder, private authenticateService: AuthenticateService, private _authenticationService: AuthenticateService, private toastService: ToastService, private _MakerTagService: MakerTagService, private _TagService: TagService) { 
    
  }

  maker: Maker;
  profielfoto
  username
  editMaker
  UserLoginId
  userInfo;
  makerTags: MakerTag[];
  tags: TagObject[];
  makerid;
  tagItems = [];
  date

  

  userForm = this.fb.group({
    Nickname: new FormControl('', Validators.required),
    Voornaam: new FormControl('', Validators.required),
    Achternaam: new FormControl('', Validators.required),
    Email: new FormControl('', Validators.required),
    Biografie: new FormControl('', Validators.required),
    LinkedInLink: new FormControl('', Validators.required),
    Ervaring: new FormControl('', Validators.required),
    Foto: new FormControl('', Validators.required),
    GeboorteDatum: new FormControl('', Validators.required),
    Id: new FormControl('', Validators.required),
    Straat: new FormControl('', Validators.required),
    Nr: new FormControl('', Validators.required),
    Postcode: new FormControl('', Validators.required),
    Stad: new FormControl('', Validators.required),
    Tags: new FormControl('', Validators.required)
  }) 


  editUserDetails(){
    if(this.editMaker == true){
      this.editMaker = false;
    }
    else{
      this.editMaker = true;
    }
  }

  saveChangesMaker(){

    console.log(this.userForm.controls[('Tags')].value);

    var tag = this.userForm.controls[('Tags')].value;

    let vmaker: Maker = {
      achternaam: this.userForm.controls[('Achternaam')].value,
      biografie: this.userForm.controls[('Biografie')].value,
      ervaring: this.userForm.controls[('Ervaring')].value,
      foto: this.userForm.controls[('Foto')].value,
      geboorteDatum: this.userForm.controls[('GeboorteDatum')].value,
      id:this.userForm.controls[('Id')].value,
      linkedInLink: this.userForm.controls[('LinkedInLink')].value,
      nr: this.userForm.controls[('Nr')].value,
      postcode: this.userForm.controls[('Postcode')].value,
      stad: this.userForm.controls[('Stad')].value,
      straat: this.userForm.controls[('Straat')].value,
      voornaam:this.userForm.controls[('Voornaam')].value,
    }

    this._MakerService.updateMakerMaker(vmaker).subscribe(
      result => {
        this.haalMakerOp();
      }
      );

  

    this._MakerTagService.deleteAllWhereMakerId(this.makerid).subscribe(
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

                let tagMaker: MakerTag = {
                  id :0,
                  interest: 1,
                  maker: null,
                  makerId: this.makerid,
                  selfSet: true,
                  tag: null,
                  tagId: result.id
                }

                this._MakerTagService.newMakerTag(tagMaker).subscribe();
              }
            );
          }
          else{
            let tagMaker: MakerTag = {
              id :0,
              interest: 1,
              maker: null,
              makerId: this.makerid,
              selfSet: true,
              tag: null,
              tagId: tag.value
            }

            this._MakerTagService.newMakerTag(tagMaker).subscribe();
          }

          this.haalMakerOp();

          
        });
      }
    );

    


    
    console.log("put");

    

      let user: UserLogin = {
        id : this.userForm.controls[('Id')].value,
        email: this.userForm.controls[('Email')].value,
        userTypeId: 2,
        username: this.userForm.controls[('Nickname')].value,
        bedrijfId: null,
        makerId: this.UserLoginId
      } 

    this.authenticateService.editUsername(this.UserLoginId, user).subscribe(
      result => {
        console.log(result);
        if(result == null){
          this.editMaker = true;
          this.toastService.show('De gebruikersnaam bestaat al!', { classname: 'bg-danger text-light', delay: 10000 });
        }
        else{
          this.editMaker = false;
          console.log("username is aangepast")
          this.toastService.show('Je gegevens zijn aangepast!', { classname: 'bg-success text-light', delay: 10000 });
        }
      },
      err => {
      }
    );
  }


  haalMakerOp(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.UserLoginId = tokenPayload.UserLoginId;
    if(tokenPayload.role = "Maker"){
      this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.maker = result;
        console.log(result.id);
        this.makerid = result.id;
        console.log(result.geboorteDatum);



        this._MakerTagService.getWhereMakerId(result.id).subscribe(result => {
          this.makerTags = result;
          var tagHelper: Array<TagObject> = [];
          result.forEach(makerTag => {
            console.log(makerTag);
            var tagObject = new TagObject(makerTag.tag.naam, makerTag.tag.id);
            tagHelper.push(tagObject)
          });
          this.tags = tagHelper;
          console.log(this.tags);
        });


        if(result.foto == null){
          this.profielfoto = "https://api.adorable.io/avatars/285/" + result.id + "@adorable.png";
        }
        else{
          this.profielfoto = "https://localhost:44341/images/"+this.maker.foto;
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


    this.haalMakerOp();
    this.getUsername();
  }

 

}

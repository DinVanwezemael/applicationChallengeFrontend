import { Component, OnInit} from '@angular/core';
import { AdminService } from '../admin.service';
import { Review } from 'src/app/models/review.model';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbRatingConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Opdracht } from 'src/app/models/opdracht.model';
import { UserLogin } from 'src/app/models/user-login.model';
import { BedrijfTagService } from 'src/app/services/bedrijf-tag.service';
import { BedrijfTag } from 'src/app/models/bedrijfTag.model';
import { TagObject } from 'src/app/models/tagObject.model';
import { BedrijfService } from 'src/app/services/bedrijf.service';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/tag.model';
import { ToastService } from 'src/app/toast-global/toast-service';
import { OpdrachtTagService } from 'src/app/services/opdracht-tag.service';
import { OpdrachtTag } from 'src/app/models/opdrachtTag.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  makers: UserLogin[] = [];
  bedrijven: UserLogin[] = [];
  reviews: Review[] = [];
  opdrachten: Opdracht[] = [];
  searchText;
  makerFilter: any = { username: '' };
  bedrijfFilter: any = { bedrijf: {naam: '' }};
  reviewerFilter = { maker: { nickname: '' }, reviewTekst: '' };
  opdrachtFilter = { titel: '' };
  closeResult: string;
  review: Review;
  opdracht: Opdracht;
  gebruiker: UserLogin;
  bedrijfTags: BedrijfTag[];
  opdrachtTags: OpdrachtTag[];
  tags: TagObject[];
  profielfoto
  editBedrijf

  reviewForm = this.fb.group({
    reviewTekst: ['']
  });

  makerForm = this.fb.group({
    Nickname: new FormControl('', Validators.required),
    Voornaam: new FormControl('', Validators.required),
    Achternaam: new FormControl('', Validators.required),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Biografie: new FormControl('', Validators.required),
    LinkedInLink: new FormControl('', Validators.required),
    Ervaring: new FormControl('', Validators.required),
    CV: new FormControl('', Validators.required),
    Foto: new FormControl('', Validators.required),
    GeboorteDatum: new FormControl('', Validators.required),
    Id: new FormControl('', Validators.required),
    Straat: new FormControl('', Validators.required),
    Nr: new FormControl('', Validators.required),
    Postcode: new FormControl('', Validators.required),
    Stad: new FormControl('', Validators.required),
  })

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
  
  opdrachtForm = this.fb.group({
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
  });

  constructor(private _OpdrachtTagService: OpdrachtTagService, private toastService: ToastService, private _adminService: AdminService, private router: Router, private fb: FormBuilder, ngbConfig: NgbRatingConfig, private modalService: NgbModal, private _BedrijfTagService: BedrijfTagService, private _BedrijfService: BedrijfService, private _TagService: TagService) {
    ngbConfig.max = 5;
  }

  ngOnInit() {
    this._adminService.getUserLoginsWhereUserTypeId(2).subscribe(result => {
      this.makers = result;
    })

    this._adminService.getUserLoginsWhereUserTypeId(3).subscribe(result => {
      this.bedrijven = result;
    })

    this._adminService.getReviews().subscribe(result => {
      this.reviews = result;
    })

    this._adminService.getOpdrachten().subscribe(result => {
      this.opdrachten = result;
    })
  }

  reviewModal(contentReview, r: Review) {
    this.review = r;
    this.modalService.open(contentReview, { ariaLabelledBy: 'review' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.ngOnInit();
  }

  opdrachtModal(contentOpdracht, o: Opdracht) {
    this.opdracht = o;
    console.log(this.opdracht);
    this._OpdrachtTagService.getWhereBedrijfId(this.opdracht.id).subscribe(result => {
      this.opdrachtTags = result;
      var tagHelper: Array<TagObject> = [];
      result.forEach(opdrachtTag => {
        var tagObject = new TagObject(opdrachtTag.tag.naam, opdrachtTag.tag.naam);
        tagHelper.push(tagObject)
      });
      this.tags = tagHelper;
    })
    this.modalService.open(contentOpdracht, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  makerModal(contentMaker, m: UserLogin) {
    console.log(this.makerForm)
    this.gebruiker = m;
    this.modalService.open(contentMaker, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  bedrijfModal(contentBedrijf, b: UserLogin) {
    console.log(b)
    this.gebruiker = b;
    this.profielfoto = "https://localhost:44341/images/"+this.gebruiker.bedrijf.foto;
    this._BedrijfTagService.getWhereBedrijfId(this.gebruiker.bedrijf.id).subscribe(result => {
      this.bedrijfTags = result;
      var tagHelper: Array<TagObject> = [];
      result.forEach(bedrijfTag => {
        var tagObject = new TagObject(bedrijfTag.tag.naam, bedrijfTag.tag.naam);
        tagHelper.push(tagObject)
      });
      this.tags = tagHelper;
    })
    this.modalService.open(contentBedrijf, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addMaker() {
    this.router.navigate(['makerForm'])
  }
  
  addBedrijf() {
    this.router.navigate(['bedrijfForm'])
  }

  updateOpdracht(o: Opdracht) {
    console.log(o)
  }

  updateReview(r: Review) {
    if(this.reviewForm.get('reviewTekst').value != "" && this.reviewForm.get('reviewTekst').value != null){
      r.reviewTekst = this.reviewForm.get('reviewTekst').value;
    }
    let review = new Review(r.id, r.makerId, r.bedrijfId, r.score, r.reviewTekst, r.naarBedrijf, r.maker);
    this._adminService.updateReview(r.id, review).subscribe();
    this.reviewForm.reset()
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  updateMaker(g: UserLogin) {
    if(this.makerForm.get('Nickname').value != "" && this.makerForm.get('Nickname').value != null){
      g.username = this.makerForm.get('Nickname').value;
    }
    if(this.makerForm.get('Email').value != "" && this.makerForm.get('Email').value != null){
      g.email = this.makerForm.get('Email').value;
    }
    if(this.makerForm.get('Voornaam').value != "" && this.makerForm.get('Voornaam').value != null){
      g.maker.voornaam = this.makerForm.get('Voornaam').value;
    }
    if(this.makerForm.get('Achternaam').value != "" && this.makerForm.get('Achternaam').value != null){
      g.maker.achternaam = this.makerForm.get('Achternaam').value;
    }
    if(this.makerForm.get('GeboorteDatum').value != "" && this.makerForm.get('GeboorteDatum').value != null){
      g.maker.geboorteDatum = this.makerForm.get('GeboorteDatum').value;
    }
    if(this.makerForm.get('Ervaring').value != "" && this.makerForm.get('Ervaring').value != null){
      g.maker.ervaring = this.makerForm.get('Ervaring').value;
    }
    if(this.makerForm.get('LinkedInLink').value != "" && this.makerForm.get('LinkedInLink').value != null){
      g.maker.linkedInLink = this.makerForm.get('LinkedInLink').value;
    }
    if(this.makerForm.get('Biografie').value != "" && this.makerForm.get('Biografie').value != null){
      g.maker.biografie = this.makerForm.get('Biografie').value;
    }
    if(this.makerForm.get('Straat').value != "" && this.makerForm.get('Straat').value != null){
      g.maker.straat = this.makerForm.get('Straat').value;
    }
    if(this.makerForm.get('Nr').value != "" && this.makerForm.get('Nr').value != null){
      g.maker.nr = this.makerForm.get('Nr').value;
    }
    if(this.makerForm.get('Postcode').value != "" && this.makerForm.get('Postcode').value != null){
      g.maker.postcode = this.makerForm.get('Postcode').value;
    }
    if(this.makerForm.get('Stad').value != "" && this.makerForm.get('Stad').value != null){
      g.maker.stad = this.makerForm.get('Stad').value;
    }
    let gebruiker = new UserLogin(g.id, g.username, g.email, g.userTypeId, g.makerId, g.bedrijfId, g.maker, g.bedrijf);
    this._adminService.updateUserLogin(g.id, gebruiker).subscribe( result => {
      console.log(result);
      if(result == null){
        this.toastService.show('De gebruikersnaam bestaat al!', { classname: 'bg-danger text-light', delay: 10000 });
      }
      else{
        this.toastService.show('Gegevens zijn aangepast!', { classname: 'bg-success text-light', delay: 10000 });
      }
    });
    this._adminService.updateMaker(g.makerId, g.maker).subscribe();
    this.makerForm.reset();
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  updateBedrijf(g: UserLogin){
    this._BedrijfService.updateBedrijf(this.bedrijfForm.controls['Id'].value , this.bedrijfForm.value).subscribe(
      result => {
        this._BedrijfTagService.deleteAllWhereBedrijfId(g.bedrijf.id).subscribe(result => {
          this.tags.forEach(tag => {
            var newTag = new Tag(0, tag.value);
            this._TagService.newTag(newTag).subscribe(result => {
              var opdrachtTag = new BedrijfTag(0, g.bedrijf.id, result.id, null, null)
              this.editBedrijf = false;
              this._BedrijfTagService.newBedrijfTag(opdrachtTag).subscribe(result => {
                this._BedrijfTagService.getWhereBedrijfId(g.bedrijf.id).subscribe(result => {
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
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  deleteReview(id: number) {
    this._adminService.deleteReview(id).subscribe();
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  deleteMaker(gebruiker: UserLogin){
    console.log(gebruiker.makerId)
    this._adminService.deleteUserLogin(gebruiker.id).subscribe();
    this._adminService.deleteSkillMakerWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteOpdrachtMakerWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteReviewWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteMaker(gebruiker.makerId).subscribe();
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }
}

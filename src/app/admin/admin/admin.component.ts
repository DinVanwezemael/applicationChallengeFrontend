import { Component, OnInit } from '@angular/core';
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
import { AuthenticateService } from 'src/app/authentication/services/authenticate.service';
import { MakerTagService } from 'src/app/services/maker-tag.service';
import { MakerTag } from 'src/app/models/maker-tag.model';
import { OpdrachtService } from 'src/app/services/opdracht.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  styles: [`
    .star {
      font-size: 50px;
      color: #b0c4de;
    }
    .filled {
      color: #F7BC07;
    }
    .filled.bad {
      color: #ff1e1e;
    }
  `] 
})
export class AdminComponent implements OnInit {
  makers: UserLogin[] = [];
  bedrijven: UserLogin[] = [];
  reviews: Review[] = [];
  opdrachten: Opdracht[] = [];
  searchText;
  makerFilter: any = { username: '' };
  bedrijfFilter: any = { bedrijf: { naam: '' } };
  reviewerFilter = { maker: { voornaam: '' } };
  opdrachtFilter = { titel: '' };
  closeResult: string;
  review: Review;
  opdracht: Opdracht;
  gebruiker: UserLogin;
  bedrijfTags: BedrijfTag[];
  opdrachtTags: OpdrachtTag[];
  makerTags: MakerTag[];
  tags: TagObject[];
  profielfoto
  editBedrijf
  tagItems = [];

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
    Tags: new FormControl('', Validators.required)
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
    Id: new FormControl('', Validators.required),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Nickname: new FormControl('', Validators.required)
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
    Open: new FormControl('', Validators.required)
  });

  constructor(private _MakerTagService: MakerTagService,
    private _OpdrachtTagService: OpdrachtTagService,
    private toastService: ToastService,
    private _adminService: AdminService,
    private router: Router,
    private fb: FormBuilder,
    ngbConfig: NgbRatingConfig,
    private modalService: NgbModal,
    private _BedrijfTagService: BedrijfTagService,
    private _BedrijfService: BedrijfService,
    private _TagService: TagService,
    private authenticateService: AuthenticateService,
    private _opdrachtService: OpdrachtService) {
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

    this.authenticateService.getTags().subscribe(result => {
      result.forEach(function (item) {
        this.tagItems.push(new TagObject(item.naam, item.id))
      }, this)
    });
  }

  reviewModal(contentReview, r: Review) {
    this.review = r;
    this.reviewForm.controls['reviewTekst'].setValue(r.reviewTekst);
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
    this._OpdrachtTagService.getWhereBedrijfId(o.id).subscribe(result => {
      this.opdrachtTags = result;
      var tagHelper: Array<TagObject> = [];
      result.forEach(opdrachtTag => {
        var tagObject = new TagObject(opdrachtTag.tag.naam, opdrachtTag.tag.id);
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
    this._MakerTagService.getWhereMakerId(m.makerId).subscribe(result => {
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
    this.modalService.open(contentMaker, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  bedrijfModal(contentBedrijf, b: UserLogin) {
    this.gebruiker = b;
    this._BedrijfTagService.getWhereBedrijfId(b.bedrijfId).subscribe(result => {
      this.bedrijfTags = result;
      var tagHelper: Array<TagObject> = [];
      result.forEach(bedrijfTag => {
        console.log(bedrijfTag);
        var tagObject = new TagObject(bedrijfTag.tag.naam, bedrijfTag.tag.id);
        tagHelper.push(tagObject)
      });
      this.tags = tagHelper;
      console.log(this.tags);
    });
    this.bedrijfForm.controls['Id'].setValue(b.bedrijf.id);
    this.bedrijfForm.controls['Naam'].setValue(b.bedrijf.naam);
    this.bedrijfForm.controls['Postcode'].setValue(b.bedrijf.postcode);
    this.bedrijfForm.controls['Stad'].setValue(b.bedrijf.stad);
    this.bedrijfForm.controls['Straat'].setValue(b.bedrijf.straat);
    this.bedrijfForm.controls['Nr'].setValue(b.bedrijf.nr);
    this.bedrijfForm.controls['Biografie'].setValue(b.bedrijf.biografie);
    this.bedrijfForm.controls['Foto'].setValue(b.bedrijf.foto);
    this.bedrijfForm.controls['Email'].setValue(b.email);
    this.bedrijfForm.controls['Nickname'].setValue(b.username);

    this.modalService.open(contentBedrijf, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log(this.bedrijfForm)
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
    this.router.navigate(['makerForm']);
    this.toastService.show('De maker is aangemaakt!', { classname: 'bg-success text-light', delay: 10000 });
  }

  addBedrijf() {
    this.router.navigate(['bedrijfForm']);
      this.toastService.show('Het bedrijf is aangemaakt!', { classname: 'bg-success text-light', delay: 10000 });
    
  }

  updateOpdracht(o: Opdracht) {
    //efficient
    if (this.opdrachtForm.get('Titel').value != "" && this.opdrachtForm.get('Titel').value != null) {
      o.titel = this.opdrachtForm.get('Titel').value;
    }
    if (this.opdrachtForm.get('Omschrijving').value != "" && this.opdrachtForm.get('Omschrijving').value != null) {
      o.omschrijving = this.opdrachtForm.get('Omschrijving').value;
    }
    if (this.opdrachtForm.get('Straat').value != "" && this.opdrachtForm.get('Straat').value != null) {
      o.straat = this.opdrachtForm.get('Straat').value;
    }
    if (this.opdrachtForm.get('StraatNr').value != "" && this.opdrachtForm.get('StraatNr').value != null) {
      o.straatNr = this.opdrachtForm.get('StraatNr').value;
    }
    if (this.opdrachtForm.get('Postcode').value != "" && this.opdrachtForm.get('Postcode').value != null) {
      o.postcode = this.opdrachtForm.get('Postcode').value;
    }
    if (this.opdrachtForm.get('Woonplaats').value != "" && this.opdrachtForm.get('Woonplaats').value != null) {
      o.woonPlaats = this.opdrachtForm.get('Woonplaats').value;
    }
    let opdracht = new Opdracht(o.id, o.titel, o.omschrijving, o.bedrijfId, o.straat, o.straatNr, o.postcode, o.woonPlaats, o.opdrachtMakers, o.bedrijf, o.open, o.klaar, o.interest);
    this._adminService.updateOpdracht(o.id, opdracht).subscribe(
      result => {
        this.toastService.show('De opdracht is geupdate!', { classname: 'bg-success text-light', delay: 10000 });
      },
      err => {
        this.toastService.show('De opdracht is niet geupdate!', { classname: 'bg-danger text-light', delay: 10000 });
      }
    );
    this.opdrachtForm.reset();
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  updateReview(r: Review) {
    r.reviewTekst = this.reviewForm.get('reviewTekst').value;
    let review = new Review(r.id, r.makerId, r.bedrijfId, r.score, r.reviewTekst, r.naarBedrijf, r.maker);
    this._adminService.updateReview(r.id, review).subscribe(
    result => {
      this.toastService.show('De review is geupdate!', { classname: 'bg-success text-light', delay: 10000 });
    },
    err => {
      this.toastService.show('De review is niet geupdate!', { classname: 'bg-danger text-light', delay: 10000 });
    });
    this.reviewForm.reset()
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  updateMaker(g: UserLogin) {
    if (this.makerForm.get('Nickname').value != "" && this.makerForm.get('Nickname').value != null) {
      g.username = this.makerForm.get('Nickname').value;
    }
    if (this.makerForm.get('Email').value != "" && this.makerForm.get('Email').value != null) {
      g.email = this.makerForm.get('Email').value;
    }
    if (this.makerForm.get('Voornaam').value != "" && this.makerForm.get('Voornaam').value != null) {
      g.maker.voornaam = this.makerForm.get('Voornaam').value;
    }
    if (this.makerForm.get('Achternaam').value != "" && this.makerForm.get('Achternaam').value != null) {
      g.maker.achternaam = this.makerForm.get('Achternaam').value;
    }
    if (this.makerForm.get('GeboorteDatum').value != "" && this.makerForm.get('GeboorteDatum').value != null) {
      g.maker.geboorteDatum = this.makerForm.get('GeboorteDatum').value;
    }
    if (this.makerForm.get('Ervaring').value != "" && this.makerForm.get('Ervaring').value != null) {
      g.maker.ervaring = this.makerForm.get('Ervaring').value;
    }
    if (this.makerForm.get('LinkedInLink').value != "" && this.makerForm.get('LinkedInLink').value != null) {
      g.maker.linkedInLink = this.makerForm.get('LinkedInLink').value;
    }
    if (this.makerForm.get('Biografie').value != "" && this.makerForm.get('Biografie').value != null) {
      g.maker.biografie = this.makerForm.get('Biografie').value;
    }
    if (this.makerForm.get('Straat').value != "" && this.makerForm.get('Straat').value != null) {
      g.maker.straat = this.makerForm.get('Straat').value;
    }
    if (this.makerForm.get('Nr').value != "" && this.makerForm.get('Nr').value != null) {
      g.maker.nr = this.makerForm.get('Nr').value;
    }
    if (this.makerForm.get('Postcode').value != "" && this.makerForm.get('Postcode').value != null) {
      g.maker.postcode = this.makerForm.get('Postcode').value;
    }
    if (this.makerForm.get('Stad').value != "" && this.makerForm.get('Stad').value != null) {
      g.maker.stad = this.makerForm.get('Stad').value;
    }
    let gebruiker = new UserLogin(g.id, g.username, g.email, g.userTypeId, g.makerId, g.bedrijfId, g.maker, g.bedrijf);
    this._adminService.updateUserLogin(g.id, gebruiker).subscribe(result => {
      console.log(result);
      if (result == null) {
        this.toastService.show('De gebruikersnaam bestaat al!', { classname: 'bg-danger text-light', delay: 10000 });
      }
      else {
        this.toastService.show('Gegevens zijn aangepast!', { classname: 'bg-success text-light', delay: 10000 });
      }
    });
    this._adminService.updateMaker(g.makerId, g.maker).subscribe(result => {
      this.toastService.show('De maker is geupdate!', { classname: 'bg-success text-light', delay: 10000 });
    },
    err => {
      this.toastService.show('De maker is niet geupdate!', { classname: 'bg-danger text-light', delay: 10000 });
    });
    this.makerForm.reset();
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  updateBedrijf(g: UserLogin) {
    console.log(this.bedrijfForm)
    g.username = this.bedrijfForm.get('Nickname').value
    g.email = this.bedrijfForm.get('Email').value

    let gebruiker = new UserLogin(g.id, g.username, g.email, g.userTypeId, g.makerId, g.bedrijfId, g.maker, g.bedrijf);
    this._adminService.updateUserLogin(g.id, gebruiker).subscribe(result => {
      console.log(result);
      if (result == null) {
        this.toastService.show('De gebruikersnaam bestaat al!', { classname: 'bg-danger text-light', delay: 10000 });
      }
      else {
        this.toastService.show('Gegevens zijn aangepast!', { classname: 'bg-success text-light', delay: 10000 });
      }
    });
    this._BedrijfService.updateBedrijf(this.bedrijfForm.controls['Id'].value, this.bedrijfForm.value).subscribe(
      result => {
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
    this._adminService.deleteReview(id).subscribe(result => {
      this.toastService.show('De review is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });
    },
    err => {
      this.toastService.show('De review is niet verwijderd!', { classname: 'bg-danger text-light', delay: 10000 });
    });
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  deleteMaker(gebruiker: UserLogin) {
    console.log(gebruiker.makerId)
    this._adminService.deleteUserLogin(gebruiker.id).subscribe();
    this._adminService.deleteSkillMakerWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteOpdrachtMakerWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteReviewWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteMakerTagWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteMaker(gebruiker.makerId).subscribe();

      this.toastService.show('De maker is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });
    

    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }

  deleteOpdracht(o: Opdracht) {
    console.log(o)
    this._opdrachtService.deleteOpdracht(o.id).subscribe(result => {
      this.toastService.show('De opdracht is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });
    },
    err => {
      this.toastService.show('De opdracht is niet verwijderd!', { classname: 'bg-danger text-light', delay: 10000 });
    });
    setTimeout(() => {
      this.ngOnInit()
    }, 150);
  }

  deleteBedrijf(gebruiker: UserLogin){
    this._adminService.deleteUserLogin(gebruiker.id).subscribe();
    this._adminService.deleteBedrijf(gebruiker.bedrijfId).subscribe();
    this._BedrijfTagService.deleteAllWhereBedrijfId(gebruiker.bedrijfId).subscribe();
    this._adminService.deleteReviewWhereBedrijfId(gebruiker.bedrijfId).subscribe();

      this.toastService.show('Het bedrijf is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });
    
  }
}

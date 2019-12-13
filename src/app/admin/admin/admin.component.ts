import { Component, OnInit} from '@angular/core';
import { AdminService } from '../admin.service';
import { Review } from 'src/app/models/review.model';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbRatingConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Opdracht } from 'src/app/models/opdracht.model';
import { UserLogin } from 'src/app/models/user-login.model';

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

  reviewForm = this.fb.group({
    reviewTekst: ['']
  });

  userForm = this.fb.group({
    Nickname: new FormControl('', Validators.required),
    Voornaam: new FormControl('', Validators.required),
    Achternaam: new FormControl('', Validators.required),
    Email: new FormControl('', Validators.required),
    Biografie: new FormControl('', Validators.required),
    LinkedInLink: new FormControl('', Validators.required),
    Ervaring: new FormControl('', Validators.required),
    CV: new FormControl('', Validators.required),
    Foto: new FormControl('', Validators.required),
    GeboorteDatum: new FormControl('', Validators.required),
    Id: new FormControl('', Validators.required)
  })
  
  opdrachtForm = this.fb.group({
  });

  constructor(private _adminService: AdminService, private router: Router, private fb: FormBuilder, ngbConfig: NgbRatingConfig, private modalService: NgbModal) {
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
    this.modalService.open(contentOpdracht, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  makerModal(contentMaker, m: UserLogin) {
    this.gebruiker = m;
    this.modalService.open(contentMaker, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
    if(this.userForm.get('Nickname').value != "" && this.userForm.get('Nickname').value != null){
      g.username = this.userForm.get('Nickname').value;
    }
    if(this.userForm.get('Email').value != "" && this.userForm.get('Email').value != null){
      g.email = this.userForm.get('Email').value;
    }
    if(this.userForm.get('Voornaam').value != "" && this.userForm.get('Voornaam').value != null){
      g.maker.voornaam = this.userForm.get('Voornaam').value;
    }
    if(this.userForm.get('Achternaam').value != "" && this.userForm.get('Achternaam').value != null){
      g.maker.achternaam = this.userForm.get('Achternaam').value;
    }
    if(this.userForm.get('GeboorteDatum').value != "" && this.userForm.get('GeboorteDatum').value != null){
      g.maker.geboorteDatum = this.userForm.get('GeboorteDatum').value;
    }
    if(this.userForm.get('Ervaring').value != "" && this.userForm.get('Ervaring').value != null){
      g.maker.ervaring = this.userForm.get('Ervaring').value;
    }
    if(this.userForm.get('LinkedInLink').value != "" && this.userForm.get('LinkedInLink').value != null){
      g.maker.linkedInLink = this.userForm.get('LinkedInLink').value;
    }
    if(this.userForm.get('Biografie').value != "" && this.userForm.get('Biografie').value != null){
      g.maker.biografie = this.userForm.get('Biografie').value;
    }
    let gebruiker = new UserLogin(g.id, g.username, g.email, g.userTypeId, g.makerId, g.bedrijfId, g.maker, g.bedrijf);
    this._adminService.updateUserLogin(g.id, gebruiker).subscribe();
    this._adminService.updateMaker(g.makerId, g.maker).subscribe();
    this.userForm.reset();
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
    //this._adminService.deleteUserLogin(gebruiker.id).subscribe();
    //this._adminService.deleteSkillMakerWhereMakerId(gebruiker.makerId).subscribe();
    //this._adminService.deleteOpdrachtMakerWhereMakerId(gebruiker.makerId).subscribe();
    this._adminService.deleteReviewWhereMakerId(gebruiker.makerId).subscribe();
    setTimeout(() => {
      this.ngOnInit()
    }, 100);
  }
}

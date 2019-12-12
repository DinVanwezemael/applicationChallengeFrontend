import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { Maker } from 'src/app/models/maker.model';
import { AdminService } from '../admin.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';
import { Review } from 'src/app/models/review.model';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbRatingConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Opdracht } from 'src/app/models/opdracht.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  makers: Maker[] = [];
  bedrijven: Bedrijf[] = [];
  reviews: Review[] = [];
  opdrachten: Opdracht[] = [];
  searchText;
  makerFilter: any = { nickname: '' };
  bedrijfFilter: any = { naam: '' };
  reviewerFilter = { maker: { nickname: '' }, reviewTekst: '' };
  opdrachtFilter = { titel: '' };
  closeResult: string;
  review: Review;
  opdracht: Opdracht;

  reviewForm = this.fb.group({
    reviewTekst: ['']
  });

  opdrachtForm = this.fb.group({
  });

  constructor(private _adminService: AdminService, private router: Router, private fb: FormBuilder, ngbConfig: NgbRatingConfig, private modalService: NgbModal) {
    ngbConfig.max = 5;
  }

  ngOnInit() {
    this._adminService.getMakers().subscribe(result => {
      this.makers = result;
    })

    this._adminService.getBedrijven().subscribe(result => {
      this.bedrijven = result;
    })

    this._adminService.getReviews().subscribe(result => {
      this.reviews = result;
    })

    this._adminService.getOpdrachten().subscribe(result => {
      this.opdrachten = result;
    })
  }

  reviewModal(content, r: Review) {
    this.review = r;
    console.log(this.review);
    this.modalService.open(content, { ariaLabelledBy: 'review' }).result.then((result) => {
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

  updateOpdracht(o: Opdracht) {
    console.log(o)
  }

  updateReview(r: Review) {
    if(this.reviewForm.get('reviewTekst').value != ""){
      r.reviewTekst = this.reviewForm.get('reviewTekst').value;
    }
    let review = new Review(r.id, r.makerId, r.bedrijfId, r.score, r.reviewTekst, r.naarBedrijf, r.maker);
    this._adminService.updateReview(r.id, review).subscribe();
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
}

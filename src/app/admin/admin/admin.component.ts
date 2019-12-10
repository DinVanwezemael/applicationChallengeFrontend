import { Component, OnInit } from '@angular/core';
import { Maker } from 'src/app/models/maker.model';
import { AdminService } from '../admin.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';
import { Review } from 'src/app/models/review.model';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbRatingConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  makers: Maker[] = [];
  bedrijven: Bedrijf[] = [];
  reviews: Review[] = [];
  searchText;
  emailFilter: any = { email: '' };
  gebruiksnaamFilter: any = { nickname: '' };
  bedrijfFilter: any = { naam: '' };
  reviewerFilter =  { maker: {nickname: '' }};
  closeResult: string;
  review: Review;

  reviewForm = this.fb.group({
  });

  constructor(private _adminService: AdminService, private router: Router, private fb: FormBuilder, ngbConfig: NgbRatingConfig, private modalService: NgbModal) {
    ngbConfig.max = 5;
    ngbConfig.readonly = true;
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
  }

  open(content, r: Review) {
    this.review = r;
    console.log(this.review);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }

  addMaker() {
    this.router.navigate(['makerForm'])
  }

  reviewDetail(r: Review){
    console.log(r)
  }
}

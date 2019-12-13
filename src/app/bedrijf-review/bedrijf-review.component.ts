import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import * as jwtDecode from 'jwt-decode';
import { ReviewBedrijf } from '../models/review-bedrijf.model';
import { BedrijfService } from '../services/bedrijf.service';

@Component({
  selector: 'app-bedrijf-review',
  templateUrl: './bedrijf-review.component.html',
  styleUrls: ['./bedrijf-review.component.scss'],
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
export class BedrijfReviewComponent implements OnInit {

  constructor(private _ReviewService: ReviewService, private route: ActivatedRoute, private router: Router, private _BedrijfService: BedrijfService) { }

  bedrijfid;
  userid;
  reviews: Review[];
  reviewed;
  reviewId;
  bedrijf


  addReview(){
    this.router.navigate(['schrijf-review'], { queryParams: { bedrijfId:this.bedrijfid, e: 0 } });
  }

  editReview(){
    this.router.navigate(['schrijf-review'], { queryParams: { bedrijfId:this.bedrijfid, e: this.reviewId } });
  }


  userReviewedCompany(){

    let review: ReviewBedrijf = {
      makerId: this.userid,
      bedrijfId: this.bedrijfid,
      naarBedrijf: true,
      reviewTekst: "",
      score: 0
    }

    this._ReviewService.makerReviewedBedrijf(review).subscribe(
      result => {
        console.log(result[0].id);
        this.reviewId = result[0].id;
        if(result == null){
          this.reviewed = false;
        }
        else{
          this.reviewed = true;
        }
      }
    );
  }

  getBedrijf(){
    this._BedrijfService.getBedrijfWhereId(this.bedrijfid).subscribe(
      result => {
        this.bedrijf = result;
      }
    );
  }

  ngOnInit() {

    this.route.queryParams
      .subscribe(params => {
        this.bedrijfid = params.bedrijfId;

        this._ReviewService.getReviewsBedrijf(this.bedrijfid).subscribe(
          result => {
            this.reviews = result;
            console.log(result);
          }
        );

      });

    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.userid = tokenPayload.GebruikerId;

    this.userReviewedCompany();
    this.getBedrijf();

  }

}

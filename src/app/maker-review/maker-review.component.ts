import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ReviewService } from '../services/review.service';
import * as jwtDecode from 'jwt-decode';
import { MakerService } from '../services/maker.service';
import { ReviewBedrijf } from '../models/review-bedrijf.model';

@Component({
  selector: 'app-maker-review',
  templateUrl: './maker-review.component.html',
  styleUrls: ['./maker-review.component.scss'],
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
export class MakerReviewComponent implements OnInit {

  constructor(private route :ActivatedRoute,private router:Router,private _MakerService:MakerService, private _ReviewService:ReviewService) { }
makerid;
reviews;
userid;
maker;
reviewed;
reviewId;
  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.makerid = params.makerId;

      this._ReviewService.getReviewsMaker(this.makerid).subscribe(
        result => {
          this.reviews = result;
          console.log(result);
        }
      );

    });

  const token = localStorage.getItem('token')
  const tokenPayload : any = jwtDecode(token);
  this.userid = tokenPayload.GebruikerId;

  this.bedrijfReviewedMaker();
  this.getMaker();

  }
  bedrijfReviewedMaker(){

    let review: ReviewBedrijf = {
      makerId: this.makerid,
      bedrijfId: this.userid,
      naarBedrijf: true,
      reviewTekst: "",
      score: 0
    }

    this._ReviewService.bedrijfReviewedMaker(review).subscribe(
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
  getMaker(){
    this._MakerService.getMakerWhereId(this.makerid).subscribe(
      result => {
        console.log(result)
        this.maker = result;
      }
    );
  }
  addReview(){
    this.router.navigate(['schrijf-makerreview'], { queryParams: { makerId:this.makerid, e: 0 } });
  }

  editReview(){
    this.router.navigate(['schrijf-makerreview'], { queryParams: { makerId:this.makerid, e: this.reviewId } });
  }
}

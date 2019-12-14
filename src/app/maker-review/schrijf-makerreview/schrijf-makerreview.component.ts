import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewBedrijf } from 'src/app/models/review-bedrijf.model';
import * as jwtDecode from 'jwt-decode';
import { ToastService } from 'src/app/toast-global/toast-service';

@Component({
  selector: 'app-schrijf-makerreview',
  templateUrl: './schrijf-makerreview.component.html',
  styleUrls: ['./schrijf-makerreview.component.scss'],
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
export class SchrijfMakerreviewComponent implements OnInit {

  constructor(private fb: FormBuilder, private _ReviewService: ReviewService, private route: ActivatedRoute, private router: Router, private toastService: ToastService) { }
  makerid
  userid
  index = 5;
  currentRate = 1;
  edit;
  reviewId;
  review: Review;
  anoniem = false;
  contentEditable;
  reviewForm = this.fb.group({
    ReviewTekst: new FormControl('', Validators.required)
  })

  rating = new FormControl(null, Validators.required);

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.makerid = params.makerId;
      this.reviewId = params.e;

      if(params.e == 0){
        this.edit = false;
      }
      else{
        this.edit = true;
        this.getReview();
      }
    });

  const token = localStorage.getItem('token')
  const tokenPayload : any = jwtDecode(token);
  this.userid = tokenPayload.GebruikerId;
  }
  annuleer(){
    this.router.navigate(['maker-review'], { queryParams: { makerId:this.makerid } });
  }
  getReview(){
    this._ReviewService.getReview(this.reviewId).subscribe(
      result => {
        this.review = result;
        this.currentRate = result.score;
        console.log(this.review);
      }
    );
  }
  
  editReview(){

    
    let review: ReviewBedrijf = {
      bedrijfId: this.userid,
      makerId: this.makerid,
      naarBedrijf: false,
      reviewTekst: this.reviewForm.controls['ReviewTekst'].value,
      score: this.currentRate
    }

    this._ReviewService.editReviewsBedrijf(this.reviewId, review).subscribe(
      result => {
        this.router.navigate(['maker-review'], { queryParams: { makerId:this.makerid } });
        this.toastService.show('Je review is aangepast!', { classname: 'bg-success text-light', delay: 10000 });
      },
      err => {
        this.toastService.show('Je review is niet aangepast!', { classname: 'bg-danger text-light', delay: 10000 });
      }
    );
  }


  deleteReview(reviewid){
    this._ReviewService.deleteReview(reviewid).subscribe(
      result => {
        this.router.navigate(['maker-review'], { queryParams: { makerId:this.makerid } });
        this.toastService.show('Je review is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });
      },
      err => {
        this.toastService.show('Je review is niet verwijderd!', { classname: 'bg-danger text-light', delay: 10000 });
      }
    );
  }
}

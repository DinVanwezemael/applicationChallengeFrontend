import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewBedrijf } from 'src/app/models/review-bedrijf.model';
import * as jwtDecode from 'jwt-decode';
import { ToastService } from 'src/app/toast-global/toast-service';

@Component({
  selector: 'app-schrijf-review',
  templateUrl: './schrijf-review.component.html',
  styleUrls: ['./schrijf-review.component.scss'],
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
export class SchrijfReviewComponent implements OnInit {

  constructor(private fb: FormBuilder, private _ReviewService: ReviewService, private route: ActivatedRoute, private router: Router, private toastService: ToastService) { }

  bedrijfid
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

  plaatsReview(){
    let review: ReviewBedrijf = {
      bedrijfId: this.bedrijfid,
      makerId: this.userid,
      naarBedrijf: true,
      reviewTekst: this.reviewForm.controls['ReviewTekst'].value,
      score: this.currentRate
    }

    console.log(this.currentRate);

    this._ReviewService.insertReviewsBedrijf(review).subscribe(
      result => {
        this.router.navigate(['bedrijf-review'], { queryParams: { bedrijfId:this.bedrijfid } });
        this.toastService.show('Je review voor het bedrijf is geplaatst!', { classname: 'bg-success text-light', delay: 10000 });
      },
      err => {
        this.toastService.show('Je review voor het bedrijf is niet geplaatst!', { classname: 'bg-danger text-light', delay: 10000 });
      }
    );
  }

  toggleEditable(event) {
    if ( event.target.checked ) {
        this.contentEditable = true;
   }

}

  editReview(){

    
    let review: ReviewBedrijf = {
      bedrijfId: this.bedrijfid,
      makerId: this.userid,
      naarBedrijf: true,
      reviewTekst: this.reviewForm.controls['ReviewTekst'].value,
      score: this.currentRate
    }

    this._ReviewService.editReviewsBedrijf(this.reviewId, review).subscribe(
      result => {
        this.router.navigate(['bedrijf-review'], { queryParams: { bedrijfId:this.bedrijfid } });
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
        this.router.navigate(['bedrijf-review'], { queryParams: { bedrijfId:this.bedrijfid } });
        this.toastService.show('Je review is verwijderd!', { classname: 'bg-success text-light', delay: 10000 });
      },
      err => {
        this.toastService.show('Je review is niet verwijderd!', { classname: 'bg-danger text-light', delay: 10000 });
      }
    );
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

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.bedrijfid = params.bedrijfId;
        this.reviewId = params.e;

        if(params.e == 0){
          console.log("###################")
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

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { ReviewBedrijf } from '../models/review-bedrijf.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http:HttpClient) { }

  getReviewsBedrijf(bedrijfId : number): Observable<Review[]>{
    return this.http.get<Review[]>("https://localhost:44341/api/review/" + bedrijfId);
  }
  getReviewsMaker(makerId : number): Observable<Review[]>{
    return this.http.get<Review[]>("https://localhost:44341/api/review/maker/" +makerId);
  }
  getReview(reviewId : number){
    return this.http.get<Review>("https://localhost:44341/api/review/getbyid" + reviewId);
  }

  insertReviewsBedrijf(review : ReviewBedrijf){
    return this.http.post<ReviewBedrijf>("https://localhost:44341/api/review/", review);
  }

  editReviewsBedrijf(reviewId: number, review : ReviewBedrijf){
    return this.http.put<ReviewBedrijf>("https://localhost:44341/api/review/" + reviewId , review);
  }

  deleteReview(reviewId: number){
    return this.http.delete("https://localhost:44341/api/review/" + reviewId);
  }

  makerReviewedBedrijf(review: ReviewBedrijf){
    return this.http.put<ReviewBedrijf>("https://localhost:44341/api/review/isreviewed/" + review.bedrijfId, review);
  }
  bedrijfReviewedMaker(review: ReviewBedrijf){
    return this.http.put<ReviewBedrijf>("https://localhost:44341/api/review/isreviewedMaker/" + review.makerId, review);
  }
}

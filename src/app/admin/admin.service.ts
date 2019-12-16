import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Maker } from '../models/maker.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Bedrijf } from '../models/bedrijf.model';
import { Review } from '../models/review.model';
import { Opdracht } from '../models/opdracht.model';
import { UserLogin } from '../models/user-login.model';

@Injectable()
export class AdminService {
  maker = new BehaviorSubject<any>(null);
  bedrijf = new BehaviorSubject<any>(null);
  opdracht = new BehaviorSubject<any>(null);

  constructor(private _httpClient: HttpClient) { 

  }

  getMakers(): Observable<Maker[]> {
    return this._httpClient.get<Maker[]>("https://localhost:44341/api/maker");
  }
  
  getBedrijven(): Observable<Bedrijf[]> {
    return this._httpClient.get<Bedrijf[]>("https://localhost:44341/api/bedrijf");
  }

  addBedrijf(bedrijf: Bedrijf) {
    return this._httpClient.post<Bedrijf>("https://localhost:44341/api/bedrijf", bedrijf);
  }

  getReviews(): Observable<Review[]> {
    return this._httpClient.get<Review[]>("https://localhost:44341/api/review");
  }

  getUserLoginsWhereUserTypeId(userTypeId: number): Observable<UserLogin[]> {
    return this._httpClient.get<UserLogin[]>("https://localhost:44341/api/userlogin/" + userTypeId)
  }

  getOpdrachten(): Observable<Opdracht[]> {
    return this._httpClient.get<Opdracht[]>("https://localhost:44341/api/opdracht");
  }

  deleteReview(reviewId: number) {
    return this._httpClient.delete<Review>("https://localhost:44341/api/review/" + reviewId);
  }

  deleteUserLogin(userLoginId: number) {
    return this._httpClient.delete<UserLogin>("https://localhost:44341/api/userlogin/" + userLoginId);
  }
  
  deleteMaker(makerId: number) {
    return this._httpClient.delete<Maker>("https://localhost:44341/api/maker/" + makerId);
  }
  
  deleteBedrijf(bedrijfId: number) {
    return this._httpClient.delete<Bedrijf>("https://localhost:44341/api/bedrijf/" + bedrijfId);
  }

  deleteOpdracht(id: number) {
    return this._httpClient.delete<Opdracht>("https://localhost:44341/api/opdracht/" + id);
  }

  editOpdracht(id: number, data: {}) {
    return this._httpClient.put<any>("https://localhost:44341/api/opdracht/EditOpdracht/" + id, data);
  }
  
  deleteSkillMakerWhereMakerId(makerId: number) {
    return this._httpClient.delete<any>("https://localhost:44341/api/skillmaker/makerid/" + makerId);
  }
  
  deleteOpdrachtMakerWhereMakerId(makerId: number) {
    return this._httpClient.delete<any>("https://localhost:44341/api/opdrachtmaker/makerid/" + makerId);
  }
  
  deleteMakerTagWhereMakerId(makerId: number) {
    return this._httpClient.delete<any>("https://localhost:44341/api/makertag/makerid/" + makerId);
  }
  
  deleteReviewWhereMakerId(makerId: number) {
    return this._httpClient.delete<any>("https://localhost:44341/api/review/makerid/" + makerId);
  }
  
  deleteReviewWhereBedrijfId(bedrijfId: number) {
    return this._httpClient.delete<any>("https://localhost:44341/api/review/bedrijfid/" + bedrijfId);
  }

  updateReview(reviewId: number, review: Review) {
    return this._httpClient.put<Review>("https://localhost:44341/api/review/" + reviewId, review);
  }
  
  updateUserLogin(userLoginId: number, userLogin: UserLogin) {
    return this._httpClient.put<UserLogin>("https://localhost:44341/api/userlogin/" + userLoginId, userLogin);
  }

  updateMaker(makerId: number, maker: Maker) {
    return this._httpClient.put<Maker>("https://localhost:44341/api/maker/" + makerId, maker);
  }
  
  updateOpdracht(opdrachtId: number, opdracht: Opdracht) {
    return this._httpClient.put<Opdracht>("https://localhost:44341/api/opdracht/" + opdrachtId, opdracht);
  }

  
  editMaker(id: number, data: {}) {
    return this._httpClient.put<any>("https://localhost:44341/api/userLogin/EditLoginMaker/" + id, data);
  }

  editBedrijf(id: number, data: {}) {
    return this._httpClient.put<any>("https://localhost:44341/api/userLogin/EditLoginBedrijf/" + id, data);
  }
}

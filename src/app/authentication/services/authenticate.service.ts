import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserRegister } from '../models/user-register.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwtDecode from 'jwt-decode';
import { Maker } from 'src/app/models/maker.model';

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {

  isLoggedin = new BehaviorSubject(false);
  currentRole = new BehaviorSubject("");

  constructor(private _httpClient: HttpClient, public jwtHelper: JwtHelperService) {
  }

  setUser(result: User) {
    localStorage.setItem("token", result.token);
  }

  authenticate(userLogin: any): Observable<any> {
    return this._httpClient.post<any>("https://localhost:44341/api/userlogin/authenticate/", userLogin);
  }

  getToken(): string {
    return localStorage.getItem("token");
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  logout() {
    localStorage.removeItem("token");
    this.currentRole.next("");
    this.isLoggedin.next(false);
  }

  register(userRegister: UserRegister): Observable<Object> {
    return this._httpClient.post<Object>("https://localhost:44341/api/User/register", userRegister);
  }

  checkUser() {
    const token = localStorage.getItem('token')

    if (!this.jwtHelper.isTokenExpired(token)) {
      this.isLoggedin.next(true);
      const tokenPayload: any = jwtDecode(token);
      this.currentRole.next(tokenPayload.role);
    } else {
      this.isLoggedin.next(false);
    }
  }

  getUserInfo() {
    return this._httpClient.get<User>("https://localhost:44341/api/User/")
  }

  editUser(userid: number, user: Maker) {
    return this._httpClient.put<Maker>("https://localhost:44341/api/Maker/" + userid, user);
  }

  editUsername(userid: number, user: User) {
    return this._httpClient.put<User>("https://localhost:44341/api/userLogin/" + userid, user);
  }

  addMaker(data: {}) {
    return this._httpClient.post<any>("https://localhost:44341/api/userLogin/AddLoginMaker", data);
  }

  addBedrijf(data: {}) {
    return this._httpClient.post<any>("https://localhost:44341/api/userLogin/AddLoginBedrijf", data);
  }
}
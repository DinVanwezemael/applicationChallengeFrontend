import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserRegister } from '../models/user-register.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {

  isLoggedin = new BehaviorSubject(false);

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
    this.isLoggedin.next(false);
  }
  
  register(userRegister: UserRegister): Observable<Object> {
    return this._httpClient.post<Object>("https://localhost:5001/api/User/register", userRegister);
  }

  checkUser() {
    const token = localStorage.getItem('token')
    
    if (!this.jwtHelper.isTokenExpired(token)) {
      this.isLoggedin.next(true);
      const tokenPayload : any = jwtDecode(token);
      console.log(tokenPayload.role);
      console.log(tokenPayload.GebruikerId);
      console.log(tokenPayload.Username);
      console.log(tokenPayload)
    } else {
      this.isLoggedin.next(false);
    }
  }
}
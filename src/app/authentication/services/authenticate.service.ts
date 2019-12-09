import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserLogin } from '../models/user-login.model';
import { UserRegister } from '../models/user-register.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {
  setUser(result: User) {
    localStorage.setItem("token", result.token);
  }

  constructor(private _httpClient: HttpClient) { }

  authenticate(userLogin: any): Observable<any> {
    return this._httpClient.post<any>("https://localhost:44341/api/userlogin/authenticate/", userLogin);
  }

  isLoggedin = new BehaviorSubject(false);

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
    if (localStorage.getItem("token")) {
      this.isLoggedin.next(true);
    } else {
      this.isLoggedin.next(false);
    }
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserRegister } from '../models/user-register.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwtDecode from 'jwt-decode';
import { Maker } from 'src/app/models/maker.model';
import { UserLogin } from 'src/app/models/user-login.model';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService {

  isLoggedin = new BehaviorSubject(false);
  userObject: any = new BehaviorSubject<any>({});
  userInfoObject = new BehaviorSubject<any>({});
  profielFoto = new BehaviorSubject<any>("");
  currentRole = new BehaviorSubject("");

  constructor(private _httpClient: HttpClient, public jwtHelper: JwtHelperService, private router: Router,) {
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
    this.userObject.next(null);
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
      this.refreshUser().subscribe(result => {
        this.userObject.next(result)
        console.log(result)
        this.setUserInfo();
       })
      console.log(this.userObject.value)

/*       if (this.currentRole.value == "Admin") {
        this.userInfoObject = this.userObject.value;
        console.log(this.userInfoObject);
      } else if (this.currentRole.value == "Bedrijf") {
        this.userInfoObject = this.userObject.value.bedrijf;
        console.log(this.userInfoObject);
      } else {
        this.userInfoObject = this.userObject.value.maker;
        console.log(this.userInfoObject);
      } */


    } else {
      this.isLoggedin.next(false);
    }
  }

  setUserInfo() {
    switch (this.currentRole.value) {
      case ("Admin"):
        this.profielFoto.next("https://api.adorable.io/avatars/285/" + this.userObject.value.admin.id + "@adorable.png");
        this.userInfoObject.next(this.userObject.value.admin);
        this.router.navigate(['adminHome'])
        break;

      case ("Maker"):
        if(this.userObject.value.maker.foto == null){
          this.profielFoto.next("https://api.adorable.io/avatars/285/" + this.userObject.value.maker.id + "@adorable.png");
        }
        else{
          this.profielFoto.next("https://localhost:44341/images/" + this.userObject.value.maker.foto);
        }
        this.userInfoObject.next(this.userObject.value.maker);
        this.router.navigate(['user-opdrachten'])
        break;

      case ("Bedrijf"):
        if(this.userObject.value.bedrijf.foto == null){
          this.profielFoto.next("https://api.adorable.io/avatars/285/" + this.userObject.value.bedrijf.id + "@adorable.png");
        }
        else{
          this.profielFoto.next("https://localhost:44341/images/" + this.userObject.value.bedrijf.foto);
        }
        this.userInfoObject.next(this.userObject.value.bedrijf);
        this.router.navigate(['bedrijfOpdrachten'])
        break;
      }
  }

  loginUser(token: string) {
      this.setToken(token);
      this.isLoggedin.next(true);
      const tokenPayload: any = jwtDecode(token);
      this.currentRole.next(tokenPayload.role);
    }

  refreshUser() {
    return this._httpClient.get<Object>("https://localhost:44341/api/userLogin/userInfo");
  }

  getUserInfo() {
    return this._httpClient.get<User>("https://localhost:44341/api/User/")
  }

  editUser(userid: number, user: Maker) {
    return this._httpClient.put<Maker>("https://localhost:44341/api/Maker/" + userid, user);
  }

  editUsername(userid: number, user: UserLogin) {
    return this._httpClient.put<UserLogin>("https://localhost:44341/api/userLogin/" + userid, user);
  }

  addMaker(data: {}) {
    return this._httpClient.post<any>("https://localhost:44341/api/userLogin/AddLoginMaker", data);
  }

  addBedrijf(data: {}) {
    return this._httpClient.post<any>("https://localhost:44341/api/userLogin/AddLoginBedrijf", data);
  }

  getLoginInfo() {
    return this._httpClient.get<any>("https://localhost:44341/api/userLogin/loginInfo");
  }

  changePassword(id: number, userLogin: any) {
    return this._httpClient.put<any>("https://localhost:44341/api/userLogin/changePassword/" + id, userLogin)
  }

  changeUserInfo(id: number, userLogin: any) {
    return this._httpClient.put<any>("https://localhost:44341/api/userLogin/changeUserInfo/" + id, userLogin)
  }

  getTags() {
    return this._httpClient.get<any>("https://localhost:44341/api/tag/");
  }

  lowerInterest() {
    return this._httpClient.get("https://localhost:44341/api/makerTag/lowerInterest");
  }

  resetPassword(email: string) {
    var emailadres = {email: email}
    return this._httpClient.post("https://localhost:44341/api/userLogin/resetPassword", emailadres);
  }

  verifyUser(id: number) {
    var verifyUser = {id: id}
    return this._httpClient.post("https://localhost:44341/api/userLogin/verifyUser", verifyUser);
  }

  authFB(token: {}) {
    return this._httpClient.post("https://localhost:44341/api/userLogin/authFB", token);
  }
}
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../services/authenticate.service';
import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private _authenticateService: AuthenticateService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    const tokenPayload: any = jwtDecode(token);

    if (!this._authenticateService.isLoggedin.value ||
      tokenPayload.role !== expectedRole) {
      console.log("Not allowed")
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}

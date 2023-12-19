import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './Login.Service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.loginService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['ChatAppClient/login']);
      return false;
    }
  }
}

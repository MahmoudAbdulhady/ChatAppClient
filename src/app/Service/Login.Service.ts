// registration.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserService } from './User.Service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isAuthenticated = false
  private userEmailSubject = new BehaviorSubject<string | null>(null);


  constructor(private http: HttpClient , private userService: UserService) {}

  Login(email: string, password: string): Observable<any> {
    const loginInfo = {
      email: email,
      password: password
    };
    
    return this.http.post('https://localhost:7216/api/account/Login', loginInfo, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          this.isAuthenticated = true; // Set isAuthenticated to true on successful login
          const userEmail = response.email
          const userRole = response.role
            this.setUserEmail(userEmail)
            this.userService.setUserRole(userRole)
        })
      );
  }


  isLoggedIn() : boolean {
    return this.isAuthenticated;
  }

  getUserEmail(): Observable<string | null> {
    return this.userEmailSubject.asObservable();
  }

  // Add a method to set the user's email
  setUserEmail(email: string | null) {
    this.userEmailSubject.next(email);
  }



 

}

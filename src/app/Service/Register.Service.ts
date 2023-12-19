// registration.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  register(email:string ,  password:string) : Observable<any>{

    const registerInfo = {
      email: email,
      password: password
    } 

    return this.http.post('https://localhost:7216/api/account/Register', registerInfo);
  }
}

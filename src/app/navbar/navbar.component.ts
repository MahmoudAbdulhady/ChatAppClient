import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginService } from '../Service/Login.Service';
import { UserService } from '../Service/User.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit  {
  userEmail : string 
  userRole : string
  

  constructor(private router : Router ,public loginService: LoginService  , public userService : UserService) {}

  ngOnInit() {
    this.userService.userEmail.subscribe(email => {
      this.userEmail = email;
      this.userRole = this.userService.getUserRole()


    });
  }

goToChat() {
  this.router.navigate(['ChatAppClient'])
}

goToActiveSessions() {
  this.router.navigate(['ChatAppClient/admin'])
}



}

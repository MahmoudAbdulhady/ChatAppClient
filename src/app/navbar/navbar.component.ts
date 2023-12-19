import { Component, OnInit } from '@angular/core';
import { UserService } from '../Service/User.Service';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit  {
  userEmail : string 
  userRole : string

  

  constructor(private router : Router ,public authService: AuthService  , public userService : UserService) {}

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

 
onLogout() {
  this.authService.logout()
  console.log("Logout Compelete")
  this.userEmail = null
  this.userRole = null
  this.router.navigate(["/ChatAppClient/login"])
}
}

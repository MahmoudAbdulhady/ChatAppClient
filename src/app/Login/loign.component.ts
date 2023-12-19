import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../Service/Login.Service";
import { Router } from "@angular/router";
import { UserService } from "../Service/User.Service";



@Component({
    selector: "app-login",
    templateUrl:"./login.component.html",
})



export class LoginComponent {
  
    loginForm: FormGroup
    userEmail: string

    constructor(private formBuilder: FormBuilder , private loginService : LoginService , private router : Router , private userService: UserService ) {}
  
    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });

      this.loginService.getUserEmail().subscribe((email) => {
        this.userEmail = email
      })

    }
  
    onSubmit() {
      if (this.loginForm.valid) {

          const email = this.loginForm.get('email').value
          const password = this.loginForm.get('password').value


        this.loginService.Login(email , password).subscribe({
          next: (response => {
            console.log("Login Completed" , response)
            const userEmail = response.email
            this.userService.setUserEmail(userEmail)
            console.log(userEmail)
            console.log(this.userService.getUserRole())
            
            this.router.navigate(["/ChatAppClient"])

          })
        })
        console.log(this.loginForm.value);
        // Call the service to send data to the backend
      }
    }

}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
})
export class RegistrationComponent implements OnInit {
 

  registrationForm: FormGroup = new FormGroup({});
  constructor(private formBuilder: FormBuilder , private authService : AuthService  , private router : Router) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {

      const email = this.registrationForm.get('email').value
      const password = this.registrationForm.get('password').value


      this.authService.register(email , password).subscribe({
        next: (response => {
          console.log("Registeration Completed" , response)
        })
      })
      console.log(this.registrationForm.value);
      this.router.navigate(["ChatAppClient/login"])
    }
  }
}

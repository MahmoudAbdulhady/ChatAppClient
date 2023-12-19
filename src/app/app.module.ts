import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './Chat/chat.component';
import { RegistrationComponent } from './Register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { appRoutes } from 'src/routes';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './Login/loign.component';
import { AdminComponent } from './Admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    RegistrationComponent,
    NavbarComponent,
    LoginComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    RouterLink
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

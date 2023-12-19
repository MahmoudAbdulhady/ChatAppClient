
import { Routes } from "@angular/router"
import { ChatComponent } from "./app/Chat/chat.component";
import { RegistrationComponent } from "./app/Register/register.component";
import { LoginComponent } from "./app/Login/loign.component";
import { AdminComponent } from "./app/Admin/admin.component";


export const appRoutes:Routes = 
[
    
    {path:"ChatAppClient" , component: ChatComponent},
    {path: "ChatAppClient/register" , component: RegistrationComponent},
    {path: "ChatAppClient/login" , component: LoginComponent},
    {path: "ChatAppClient/admin" , component: AdminComponent},
    { path: '', redirectTo: '/ChatAppClient', pathMatch: 'full' }

];
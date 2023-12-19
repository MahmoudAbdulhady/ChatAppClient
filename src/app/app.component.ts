import { Component } from '@angular/core';
import { ChatService } from './Service/Chat.Service';

@Component({
  selector: 'app-root',
  template:`
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  ` ,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatAppClient';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.startConnection().subscribe({
      next: () => {
        console.log('SignalR connection established');
      },
      error: (error) => {
        console.error('Error establishing SignalR connection:', error);
      }
    });
  }
  
}

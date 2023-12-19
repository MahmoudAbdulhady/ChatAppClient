import { Component, OnInit } from '@angular/core';
import { ChatService } from '../Service/Chat.Service';
import { UserService } from '../Service/User.Service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls:["./chat.component.css"]
})
export class ChatComponent implements OnInit  {
  public messages: string[] = [];
  public message: string = "";
  public user: string = "";
  public sessionId: string;
  public showChat: boolean = false;
  public currentSessionId: string;
  public userRole : string


  private inactivityTimer: Subscription;
  private inactivityDuration = 60 * 1000; // 1 minute in milliseconds

  constructor(private chatService: ChatService , public userService : UserService) {
    
  }

    ngOnInit() {
      this.userRole = this.userService.getUserRole()
      this.chatService.messageReceived$.subscribe(
        ({ user, message }) => {
          console.log(`Received message: ${user}: ${message}`);
          this.messages.push(`${user}: ${message}`);
        }
      );

        //new
          this.chatService.addMessageSentListener((message) => {
        console.log("Message sent:", message);
        // Handle the 'sent' flag here
})

      this.userService.userEmail.subscribe(email => {
        if (email) {
          this.user = email;
        }
      });
    }
  
  startChat() {
    this.showChat = true;
    this.chatService.startConnection().subscribe({
      next: () => {
        this.chatService.startChat().subscribe({
          next: (sessionId) => {
            if (sessionId) {
              this.currentSessionId = sessionId;
              this.chatService.addMessageListener();
            } else {
              console.error('Failed to get a valid session ID');
            }
          },
          error: (err) => console.error(err)
        });
      },
      error: (err) => console.error('Error while starting connection: ' + err)
    });
  }


  sendMessage() {
    const trimmedMessage = this.message.trim();
  
    if (!this.currentSessionId || !trimmedMessage) {
      console.error('Session ID or message is missing');
      return;
    }
  
    this.chatService.sendMessage(this.currentSessionId, trimmedMessage).subscribe(
      () => {
        console.log('Message sent');
        // The message will be added to the messages array via the subscription to the messageReceived$ observable
        this.message = ''; // Clear the message input after sending
      },
      err => console.error('Error sending message:', err)
    );
  }
  

}
// admin.component.ts

import { Component, OnInit } from '@angular/core';
import { ChatService } from '../Service/Chat.Service';
import { UserService } from '../Service/User.Service';

@Component({
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  public activeSessions: string[] = [];
  public selectedSessionId: string
  public userRole : string


  public messages: string[] = [];
  public messageSentStatus: boolean[] =[];
  public message: string = "";
  public user: string = "";
  public showChat: boolean = false;
  connectedUsersCount: number

  connectedUsers: string[] = [];



  constructor(public chatService: ChatService , private userService: UserService) {}


  ngOnInit() {
    this.chatService.addMessageListener()
    this.chatService.messageReceived$.subscribe(
      ({ user, message }) => {
        this.messages.push(`${user}: ${message}`);
      }
    )
    this.userRole = this.userService.getUserRole()
    console.log(this.userRole)
    if (this.chatService.isConnected()) {
      // Call methods on chatService as needed
    } else {
      console.error('SignalR connection not established');
    }
  }

  getActiveSessions() {
    this.chatService.getActiveSessionIds().subscribe(
      (sessionIds) => {
          this.activeSessions = sessionIds;
      },
      (error) => {
          console.error('Error fetching active sessions:', error);
      }
  );  }
  
  joinChatSession(): void {
    if (this.selectedSessionId) {
      console.log("Attempting to join session ID:", this.selectedSessionId);
      this.chatService.joinChatSession(this.selectedSessionId).subscribe({
        next: () => {
          this.showChat = true; // Successfully joined the session, activate the chat interface
        },
        error: (err) => {
          console.error('Error joining chat session:', err);
        }
      });
    } else {
      console.error('No active session ID selected to join.');
    }
  }


  sendMessage() {
    const sessionId = this.selectedSessionId;
    const trimmedMessage = this.message.trim();
  
    if (!sessionId || !trimmedMessage) {
      console.error('Session ID or message is missing');
      return;
    }
  
    this.chatService.sendMessage(sessionId, trimmedMessage).subscribe(
      () => {
        console.log('Message sent');

        const index = this.messages.lastIndexOf(trimmedMessage);
        if (index !== -1) {
          this.messageSentStatus[index] = true;
        }

        // As with the chat component, the message will be added via the subscription to messageReceived$
        this.message = ''; // Clear the message input field after sending
      },
      err => console.error('Error sending message:', err)
    );
  }

}

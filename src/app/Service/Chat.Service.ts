import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject, catchError, from, map, of, tap, throwError } from 'rxjs';
import { UserService } from './User.Service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public hubConnection!: signalR.HubConnection 
  public currentSessionId: string;

  private messageReceived = new Subject<{ user: string, message: string }>();
  public messageReceived$ = this.messageReceived.asObservable();

 
constructor(private userService : UserService) {}

  public startConnection(): Observable<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7216/chatHub', { withCredentials: true })
      .build();
  
    return from(this.hubConnection.start()).pipe(
      tap(() => {
        console.log('Connection started');
      }),
      catchError(err => {
        console.error('Error while starting connection: ' + err);
        return throwError(err); // Re-throw the error as an Observable
      })
    );
  }

  public isConnected(): boolean {
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }


  public addMessageListener(): void {
    this.hubConnection.off('ReceiveMessage'); // Remove existing listeners to avoid duplicates
    this.hubConnection.on('ReceiveMessage', (user, message) => {
      this.messageReceived.next({ user, message });
    });
  }
  


  public startChat(): Observable<string | null> {
    return from(this.hubConnection.invoke<string>('StartChat')).pipe(
      map((sessionId: string) => {
        this.userService.setSessionId(sessionId);
        console.log('Chat session started with ID:', sessionId);
        return sessionId;
      }),
      catchError(err => {
        console.error('Error starting chat session:', err);
        // Return an Observable with null value
        return of(null);
      })
    );
  }
  

public getCurrentSessionId(): string {
  return this.currentSessionId;
}


getActiveSessionIds(): Observable<string[]> {
  return from(this.hubConnection.invoke<string[]>('GetActiveSessionIds'));
}


public joinChatSession(sessionId: string): Observable<void> {
  return from(this.hubConnection.invoke('JoinChatSession', sessionId)).pipe(
    catchError(err => {
      console.error('Error joining chat session:', err);
      return throwError(err); // Re-throw the error as an Observable
    })
  );
}

  public sendMessage(sessionId: string, message: string): Observable<void> {
    return from(this.hubConnection.invoke('SendMessage', sessionId, message))
      .pipe(
        catchError(err => {
          console.error('Error sending message:', err);
          return throwError(err); // Re-throw the error as an Observable
        })
      );
  }
}


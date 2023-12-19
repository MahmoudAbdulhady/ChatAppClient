

import { Injectable } from "@angular/core";
import { Observable , Subject } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private userEmailSource = new BehaviorSubject<string | null>(null);
    userEmail = this.userEmailSource.asObservable();
    private sessionId = new Subject<string>();
    private userRoleSource = new BehaviorSubject<string | null>(null);
    userRole: Observable<string | null> = this.userRoleSource.asObservable();
  



    setSessionId(sessionId: string) {
      this.sessionId.next(sessionId);
    }

    getSessionId() {
      return this.sessionId.asObservable();
    }


    setUserEmail(email: string) {
        this.userEmailSource.next(email);
      }

      setUserRole(role: string) {
        this.userRoleSource.next(role);
      }
    
      getUserRole(): string | null {
        return this.userRoleSource.value;
      }

}

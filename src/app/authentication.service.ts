import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GatewayService } from './gateway.service';

/**
 * App's authentication service
 */

const STORE_NAME = 'finMan.user';

@Injectable()
export class AuthenticationService {

  private localRouter: Router;
  private httpGateway: GatewayService;

  constructor(_router: Router, _gateway: GatewayService) {
    this.localRouter = _router;
    this.httpGateway = _gateway;
   }

   /**
    * Logout user and removes user from the store
    */
   public logout() {
     localStorage.removeItem(STORE_NAME);
   }

   /**
    * Perform login and store the logged in user ID in the store
    * @param email
    */
   public login(email: string): string {
     let redirectTo: string = null;
     if (this.checkCredential(email)) {
      localStorage.setItem(STORE_NAME, email);
      redirectTo = '/home';
     } else {
      redirectTo = '/login';
     }
     return redirectTo;
   }

   private checkCredential(email: string): boolean {
     // TODO make HTTP to check if user is valid
     return true;
   }

   private isAlreadyLoggedIn(): boolean {
     if (localStorage.getItem(STORE_NAME) != null) {
       return true;
     } else {
      return false;
     }
   }

   /**
    * Gets logged in user details from the store
    */
   public getLoggedInUser(): string {
     const returnVal: string = localStorage.getItem(STORE_NAME);
     return returnVal;
   }

   /**
    * Check if use active login exist
    */
   public checkLogin(): boolean {
     return this.isAlreadyLoggedIn();
   }
}

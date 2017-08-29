import { Injectable } from '@angular/core';

import { GatewayService } from './gateway.service';
import { UserModel } from './type/app-model';
import { Callbackable } from './type/callbackable';
import { AppComponent } from './app.component';

/**
 * App's authentication service
 */

const STORE_EMAIL = 'finMan.email';
const STORE_FNAME = 'finMan.fname';
const STORE_LNAME = 'finMan.lname';

@Injectable()
export class AuthenticationService implements Callbackable{

  private appComponent: AppComponent;

  constructor(private httpGateway: GatewayService) { }

   /**
    * Logout user and removes user from the store
    */
   public logout() {
     sessionStorage.removeItem(STORE_EMAIL);
     sessionStorage.removeItem(STORE_FNAME);
     sessionStorage.removeItem(STORE_LNAME);
   }

   /**
    * Perform login and store the logged in user ID in the store
    * @param email
    */
   public login(email: string): string {
     let redirectTo: string = null;
     if (null !== email || undefined !== email) {
      sessionStorage.setItem(STORE_EMAIL, email);
      redirectTo = '/home';
      this.loadUserDetails(email);
     } else {
      redirectTo = '/login';
     }
     return redirectTo;
   }

   private loadUserDetails(email: string) {
     this.httpGateway.getUser(this, email);
   }

   private isAlreadyLoggedIn(): boolean {
     if (null !== sessionStorage.getItem(STORE_EMAIL) && undefined !== sessionStorage.getItem(STORE_EMAIL)) {
       return true;
     } else {
      return false;
     }
   }

   /**
    * Gets logged in user details from the store
    */
   public getLoggedInUser(): string {
     const returnVal: string = sessionStorage.getItem(STORE_EMAIL);
     return returnVal;
   }

   /**
    * Check if use active login exist
    */
   public checkLogin(): boolean {
     const alreadyLoggedIn: boolean = this.isAlreadyLoggedIn();
     if (alreadyLoggedIn) {
      this.appComponent.toggleNavbarLinks(false);
      this.appComponent.fname = sessionStorage.getItem(STORE_FNAME);
      this.appComponent.lname = sessionStorage.getItem(STORE_LNAME);
      this.appComponent.email = sessionStorage.getItem(STORE_EMAIL);
     }
     return alreadyLoggedIn;
   }

   setupValue(result: UserModel) {
    sessionStorage.setItem(STORE_FNAME, result.getFirstName());
    sessionStorage.setItem(STORE_LNAME, result.getLastName());
    this.appComponent.toggleNavbarLinks(false);
    this.appComponent.fname = result.getFirstName();
    this.appComponent.lname = result.getLastName();
    this.appComponent.email = result.getEmail();
  }

  getAppModel(jsonResult: any): UserModel {
    const userModel: UserModel = new UserModel();
    userModel.setEmail(jsonResult.userModel.email);
    userModel.setFirstName(jsonResult.userModel.firstName);
    userModel.setLastName(jsonResult.userModel.lastName);
    return userModel;
  }

  public setAppComponent(appComponent: AppComponent) {
    this.appComponent = appComponent;
  }
}

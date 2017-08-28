import { Component, OnInit } from '@angular/core';
import { GatewayService } from '../gateway.service';
import { Callbackable } from '../type/callbackable';
import { UserModel } from '../type/app-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, Callbackable {

  email: string;
  fname: string;
  lname: string;
  errMsg: string;

  fnameHasError: boolean;
  lnameHasError: boolean;
  emailHasError: boolean;

  constructor(private gateway: GatewayService, private router: Router) { }

  ngOnInit() {
    this.fnameHasError = false;
    this.lnameHasError = false;
    this.emailHasError = false;
  }

  register() {
    if (this.validateForm()) {
      let user: UserModel = new UserModel();
      user.setEmail(this.email);
      user.setFirstName(this.fname);
      user.setLastName(this.lname);
      this.gateway.addUser(this, user);
    }
  }

  private validateForm(): boolean {
    let retValue = true;
    if (undefined === this.fname || null === this.fname || '' === this.fname.trim()) {
      this.fnameHasError = true;
      retValue = false;
    } else {
      this.fnameHasError = false;
    }
    if (undefined === this.lname || null === this.lname || '' === this.lname.trim()) {
      this.lnameHasError = true;
      retValue = false;
    } else {
      this.lnameHasError = false;
    }
    if (undefined === this.email || null === this.email || '' === this.email.trim()) {
      this.emailHasError = true;
      retValue = false;
    } else {
      this.emailHasError = false;
    }
    return retValue;
  }

  private navigateToLogin() {
    this.router.navigate(['/login']);
  }

  setupValue(result: UserModel) {
    if (null !== result && undefined !== result) {
      this.email = result.getEmail();
      this.fname = result.getFirstName();
      this.lname = result.getLastName();
      if (this.errMsg.trim() === '') {
        this.navigateToLogin();
      }
    } else {
      this.errMsg = 'Backend error';
    }
  }

  getAppModel(jsonResult: any): UserModel {
    let userModel: UserModel = new UserModel();
    if (jsonResult.message === 'fail') {
      this.errMsg = jsonResult.userModel;
    } else {
      this.errMsg = ' ';
      userModel.setEmail(jsonResult.userModel.email);
      userModel.setFirstName(jsonResult.userModel.firstName);
      userModel.setLastName(jsonResult.userModel.lastName);
    }
    return userModel;
  }

}

import { Component, OnInit } from '@angular/core';
import { UserModel, AppModel, UserListModel } from '../type/app-model';
import { GatewayService } from '../gateway.service';
import { AuthenticationService } from '../authentication.service';
import { Callbackable } from '../type/callbackable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, Callbackable {

  email: string;
  errorMsg: string;
  hasFormError: boolean;
  userDetails: UserModel[];

  constructor(private gateway: GatewayService, private authService: AuthenticationService,
    private router: Router) {
    this.hasFormError = false;
    this.email = '-1';
   }

  ngOnInit() {
    this.gateway.getAllUser(this);
  }

  login() {
    if(this.email == null || this.email.trim() === '' || this.email.trim() === '-1') {
      this.errorMsg = 'Please enter a valid email address';
      this.hasFormError = true;
    } else {
      this.errorMsg = '';
      this.hasFormError = false;
      let navigateTo: string;
      navigateTo = this.authService.login(this.email);
      this.router.navigate([navigateTo]);
    }
  }

  private loadUserList() {
    console.log('pending');
  }

  setupValue(result: UserListModel) {
    this.userDetails = result.getUserModels();
  }

  getAppModel(jsonResult: any): AppModel {
    let userModelList: UserListModel;
    userModelList = new UserListModel();
    if (undefined === jsonResult || null === jsonResult || undefined === jsonResult.message || null === jsonResult.message) {
      this.errorMsg = 'Invalid Result';
    } else {
      if (jsonResult.message === 'error') {
        this.errorMsg = jsonResult.items;
      } else {
        jsonResult.items.forEach(element => {
          let user = new UserModel();
          user.setEmail(element);
          userModelList.addUserModel(user);
        });

      }
    }
    return userModelList;
  }

}

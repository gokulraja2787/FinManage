/**
 * Home component for FinManage
 */
import { Component, OnInit } from '@angular/core';
import { MYAPPCONFIG } from '../config/APPCONST';
import { CGIAppDetails } from './type/cgiapp-details';
import { AppModel } from './type/app-model';
import { GatewayService } from './gateway.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { Callbackable } from './type/callbackable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, Callbackable {

  title = MYAPPCONFIG.appTitle;
  ver = MYAPPCONFIG.appVer;
  name = MYAPPCONFIG.appName;

  cgiAppName: string;
  cgiAppVer: string;

  email: string;
  fname: string;
  lname: string;

  navbarLinks = [{link: '/home', text: 'Home', disabled: false},
      {link: '/am', text: 'Bank Account Management', disabled: false},
      {link: '/bs', text: 'Budget Sheet', disabled: false}];

  constructor(private gateWayService: GatewayService,
    private authService: AuthenticationService,
    private router: Router) {
      this.authService.setAppComponent(this);
    }

  ngOnInit(): void {
    this.gateWayService.whoAreYou(this);
    if (!this.authService.checkLogin()) {
      this.router.navigate(['/login']);
      this.toggleNavbarLinks(true);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toggleNavbarLinks(true);
  }

  public setupValue(cgiDetails: CGIAppDetails) {
    this.cgiAppName = cgiDetails.getAppName();
    this.cgiAppVer = cgiDetails.getAppVersion();
  }

  public getAppModel(jsonResult: any): AppModel {
    let cgiDetails: CGIAppDetails;
    cgiDetails = new CGIAppDetails(jsonResult.appName, jsonResult.appVersion);
    return cgiDetails;
  }

  public toggleNavbarLinks(mode: boolean) {
    for (const item of this.navbarLinks) {
      item.disabled = mode;
    }
  }

}

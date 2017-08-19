/**
 * Home component for FinManage
 */
import { Component, OnInit } from '@angular/core';
import { MYAPPCONFIG } from '../config/APPCONST';
import { CGIAppDetails } from './type/cgiapp-details';
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

  navbarLinks = [{link: '/home', text: 'Home', disabled: false},
      {link: '/bam', text: 'Bank Account Management', disabled: false},
      {link: '/bs', text: 'Budget Sheet', disabled: true}];

  constructor(private gateWayService: GatewayService,
    private authService: AuthenticationService,
    private router: Router) {  }

  ngOnInit(): void {
    this.gateWayService.whoAreYou(this);
    if (!this.authService.checkLogin()) {
      this.router.navigate(['/login']);
      this.toggleNavbarLinks(true);
    }
  }

  public setupValue(cgiDetails: CGIAppDetails) {
    console.log('Callback result: ' + cgiDetails);
    this.cgiAppName = cgiDetails.getAppName();
    this.cgiAppVer = cgiDetails.getAppVersion();
  }

  private toggleNavbarLinks(mode: boolean) {
    for (const item of this.navbarLinks) {
      item.disabled = mode;
    }
  }

}

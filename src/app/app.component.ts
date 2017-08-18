/**
 * Home component for FinManage
 */
import { Component, OnInit } from '@angular/core';
import { MYAPPCONFIG } from '../config/APPCONST';
import { CGIAppDetails } from './type/cgiapp-details';
import { GatewayService } from './gateway.service';
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

  constructor(private gateWayService: GatewayService) {  }

  ngOnInit(): void {
    this.gateWayService.whoAreYou(this);
  }

  public setupValue(cgiDetails: CGIAppDetails) {
    console.log('Callback result: ' + cgiDetails);
    this.cgiAppName = cgiDetails.getAppName();
    this.cgiAppVer = cgiDetails.getAppVersion();
  }

}

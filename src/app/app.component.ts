/**
 * Home component for FinManage
 */
import { Component, OnInit } from '@angular/core';
import { MYAPPCONFIG } from '../config/APPCONST';
import { CGIAppDetails } from './type/cgiapp-details';
import { GatewayService } from './gateway.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = MYAPPCONFIG.appTitle;
  ver = MYAPPCONFIG.appVer;
  name = MYAPPCONFIG.appName;

  cgiAppName: string;
  cgiAppVer: string;

  constructor(private gateWayService: GatewayService) {  }

  private getCGIDetails(){
      this.gateWayService.whoAreYou(this);
    }

  ngOnInit(): void {
    this.getCGIDetails();
  }

  public setUpValue(cgiDetails: CGIAppDetails) {
    console.log('Callback result: ' + cgiDetails);
    this.cgiAppName = cgiDetails.getAppName();
    this.cgiAppVer = cgiDetails.getAppVersion();
  }

}

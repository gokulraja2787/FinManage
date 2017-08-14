/**
 * Home component for FinManage
 */
import { Component } from '@angular/core';
import { MYAPPCONFIG } from '../config/APPCONST';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = MYAPPCONFIG.appTitle;
  ver = MYAPPCONFIG.appVer;
  name = MYAPPCONFIG.appName;
}

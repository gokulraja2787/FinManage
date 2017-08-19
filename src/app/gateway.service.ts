import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { MYAPPCONFIG } from '../config/APPCONST';
import { CGIAppDetails } from './type/cgiapp-details';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Callbackable } from './type/callbackable';

/**
 * Common HTTP gateway service
 */

@Injectable()
export class GatewayService {

  private baseUrl: string;

  constructor(private http: Http) { 
    this.baseUrl = MYAPPCONFIG.baseUrl;
   }

   /**
    * Performs GET http://localhost:4301/whoareyou
    */
  public whoAreYou(callbackObj: Callbackable) {
    const serviceUrl = this.baseUrl + 'whoareyou';
    this.makeHttpGet(serviceUrl, callbackObj);
  }

  private makeHttpGet(serviceUrl: string, callbackObj: Callbackable) {
    let result: CGIAppDetails;
    this.http.get(serviceUrl, {headers: this.getHeaders(), }).map(response => response.json())
    .subscribe(
      data => result = new CGIAppDetails(data.appName, data.appVersion),
      error => console.error('Something wrong!!!'),
        // () => console.log('OK ' + result)
        () => callbackObj.setupValue(result)
      );
  }

  private getHeaders(): Headers{
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

}

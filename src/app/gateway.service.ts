import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { MYAPPCONFIG } from '../config/APPCONST';
// import { CGIAppDetails } from './type/cgiapp-details';
import { AppModel, UserModel } from './type/app-model';
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

  public getUser(callbackObj: Callbackable, email: string) {
    const serviceUrl = this.baseUrl + 'users/get?email=' + email;
    this.makeHttpGet(serviceUrl, callbackObj);
  }

  public getAllUser(callbackObj: Callbackable) {
    const serviceUrl = this.baseUrl + 'users/list';
    this.makeHttpGet(serviceUrl, callbackObj);
  }

  public addUser(callbackObj: Callbackable, user: UserModel) {
    const serviceUrl = this.baseUrl + 'users/add';
    const parms: any = {};
    parms.firstName = user.getFirstName();
    parms.lastName = user.getLastName();
    parms.email = user.getEmail();
    const params: {} = <JSON>parms;
    this.makeHttpPost(serviceUrl, params, callbackObj);
  }

  private makeHttpGet(serviceUrl: string, callbackObj: Callbackable) {
    let result: AppModel;
    this.http.get(serviceUrl, {headers: this.getHeaders() }).map(response => response.json())
    .subscribe(
      data => result = callbackObj.getAppModel(data),
      error => console.error('Something wrong!!!'),
        // () => console.log('OK ' + result)
        () => callbackObj.setupValue(result)
      );
  }

  private makeHttpPost(serviceUrl: string, params: {}, callbackObj: Callbackable) {
    let result: AppModel;
    this.http
      .post(serviceUrl, JSON.stringify(params), {headers: this.getHeaders() })
      .map(response => response.json())
      .subscribe(
        data => result = callbackObj.getAppModel(data),
        error => console.error('Something wrong!!!'),
          // () => console.log('OK ' + result)
          () => callbackObj.setupValue(result));
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

}

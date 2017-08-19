import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  errorMsg: string;

  constructor() { }

  ngOnInit() {
  }

  login() {
    if(this.email == null || this.email.trim() === '') {
      this.errorMsg = 'Please enter a valid email address';
    } else {
      this.errorMsg = '';
    }
  }
}

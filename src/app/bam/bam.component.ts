import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GatewayService } from '../gateway.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-bam',
  templateUrl: './bam.component.html',
  styleUrls: ['./bam.component.css']
})
export class BamComponent implements OnInit {

  bamModuleLinks = [{link: '/list', text: 'List Accounts', disabled: false},
  {link: '/addAccounts', text: 'Add Accounts', disabled: true}];

  constructor(private gateWayService: GatewayService,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    if (!this.authService.checkLogin()) {
      this.router.navigate(['/login']);
    }
  }

}

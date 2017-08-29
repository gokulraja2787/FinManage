/**
 * Home module for FinManage
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GatewayService } from './gateway.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BamComponent } from './bam/bam.component';
import { AuthenticationService } from './authentication.service';
import { RegisterComponent } from './register/register.component';
import { BsComponent } from './bs/bs.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'bam', component: BamComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'bs', component: BsComponent},
  {
    path: '' ,
    redirectTo: '/home',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    BamComponent,
    RegisterComponent,
    BsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [GatewayService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

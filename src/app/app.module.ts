import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginModule } from './login/login.module';
import { LoginComponent } from './login/login/login.component';
import { AdminComponent } from './admin/admin/admin.component';
import { AdminModule } from './admin/admin.module';


const appRoutes: Routes = [
  //{ path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'adminHome', component: AdminComponent}
  ];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    AppRoutingModule,
    AdminModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

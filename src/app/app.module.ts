import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from './login/login.module';
import { LoginComponent } from './login/login/login.component';
import { RegisterModule } from './register/register.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { AdminComponent} from './admin/admin/admin.component'
import { AdminModule} from './admin/admin.module'

const appRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'userdetail',component:UserDetailComponent},
  { path: 'adminHome', component: AdminComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    UserDetailComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    LoginModule,
    AppRoutingModule,
    AdminModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    NgbModule,
    RegisterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

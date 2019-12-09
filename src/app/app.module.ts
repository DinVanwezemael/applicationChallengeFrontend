import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { AdminComponent} from './admin/admin/admin.component'
import { AdminModule} from './admin/admin.module'
import { AuthenticateService } from './authentication/services/authenticate.service';
import { InterceptorService } from './authentication/services/interceptor.service';
import { LoggerService } from './authentication/services/logger-service.service';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

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
    FileSelectDirective,
    RegisterComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthenticateService,
    InterceptorService,
    LoggerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

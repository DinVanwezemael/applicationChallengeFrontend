import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { AdminComponent } from './admin/admin/admin.component'
import { AdminModule } from './admin/admin.module'
import { AuthenticateService } from './authentication/services/authenticate.service';
import { InterceptorService } from './authentication/services/interceptor.service';
import { LoggerService } from './authentication/services/logger-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './authentication/login/login.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { RegisterComponent } from './authentication/register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './authentication/guards/auth.guard';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MakerFormComponent } from './maker-form/maker-form.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'userdetail', component: UserDetailComponent },
  { path: 'adminHome', component: AdminComponent },
  { path: 'makerForm', component: MakerFormComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    UserDetailComponent,
    FileSelectDirective,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    MakerFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthenticationModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }, 
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS 
    },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

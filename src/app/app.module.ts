import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AdminComponent } from './admin/admin/admin.component'
import { AdminModule } from './admin/admin.module'
import { AuthenticateService } from './authentication/services/authenticate.service';
import { InterceptorService } from './authentication/services/interceptor.service';
import { LoggerService } from './authentication/services/logger-service.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './authentication/login/login.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { RegisterComponent } from './authentication/register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './authentication/guards/auth.guard';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MakerFormComponent } from './admin/maker-form/maker-form.component';
import { RoleGuard } from './authentication/guards/role.guard';
import { BedrijfOpdrachtenComponent } from './bedrijf-opdrachten/bedrijf-opdrachten.component';
import { MakerComponent } from './user-detail/maker/maker.component';
import { OpdrachtDetailComponent } from './opdracht-detail/opdracht-detail.component';
import { BedrijfComponent } from './user-detail/bedrijf/bedrijf.component';
import { UserOpdrachtenComponent } from './user-opdrachten/user-opdrachten.component';
import { OpdrachtStemmenComponent } from './user-opdrachten/opdracht-stemmen/opdracht-stemmen.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestemdeOpdrachtenComponent } from './user-opdrachten/gestemde-opdrachten/gestemde-opdrachten.component';
import { BedrijfFormComponent } from './admin/bedrijf-form/bedrijf-form.component';
import { CredentialsComponent } from './authentication/credentials/credentials.component';
import { BedrijfReviewComponent } from './bedrijf-review/bedrijf-review.component';
import { SchrijfReviewComponent } from './bedrijf-review/schrijf-review/schrijf-review.component';
import { NgbdToastGlobal } from './toast-global/toast-global.component';
import { ToastsContainer } from './toast-global/toast-container.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OpdrachtMakerComponent } from './opdracht-maker/opdracht-maker.component';
import { MakerReviewComponent } from './maker-review/maker-review.component';
import { SchrijfMakerreviewComponent } from './maker-review/schrijf-makerreview/schrijf-makerreview.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { VerifyUserComponent } from './authentication/verify-user/verify-user.component';
import { OpdrachtFormComponent } from './admin/opdracht-form/opdracht-form.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  // Role restriction example: { path: '', component: HomeComponent, canActivate: [RoleGuard], data: {expectedRole: 'Admin'} }, ### Admin, Maker, Bedrijf
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'userdetail', component: UserDetailComponent },
  { path: 'adminHome', component: AdminComponent, canActivate: [RoleGuard], data: {expectedRole: 'Admin'}},
  { path: 'makerForm', component: MakerFormComponent, canActivate: [RoleGuard], data: {expectedRole: 'Admin'}},
  { path: 'opdrachtForm', component: OpdrachtFormComponent, canActivate: [RoleGuard], data: {expectedRole: 'Admin'}},
  { path: 'bedrijfForm', component: BedrijfFormComponent, canActivate: [RoleGuard], data: {expectedRole: 'Admin'}},
  { path: 'bedrijfOpdrachten', component: BedrijfOpdrachtenComponent, canActivate:[RoleGuard],data: {expectedRole:'Bedrijf'}},
  { path: 'opdrachtDetail', component: OpdrachtDetailComponent, canActivate:[RoleGuard],data: {expectedRole:'Bedrijf'}},
  { path: 'user-opdrachten', component: UserOpdrachtenComponent, canActivate:[RoleGuard],data: {expectedRole:'Maker'}},
  { path: 'opdracht-stemmen', component: OpdrachtStemmenComponent, canActivate:[RoleGuard],data: {expectedRole:'Maker'}},
  { path: 'opdracht-maker', component: OpdrachtMakerComponent, canActivate:[RoleGuard],data: {expectedRole:'Bedrijf'}},
  { path: 'gestemde-opdrachten', component: GestemdeOpdrachtenComponent, canActivate:[RoleGuard],data: {expectedRole:'Maker'}},
  { path: 'bedrijf-review', component: BedrijfReviewComponent, canActivate:[RoleGuard],data: {expectedRole:'Maker'}},
  { path: 'maker-review', component: MakerReviewComponent, canActivate:[RoleGuard],data: {expectedRole:'Bedrijf'}},
  { path: 'schrijf-review', component: SchrijfReviewComponent, canActivate:[RoleGuard],data: {expectedRole:'Maker'}},
  { path: 'schrijf-makerreview', component: SchrijfMakerreviewComponent, canActivate:[RoleGuard],data: {expectedRole:'Bedrijf'}},
  { path: 'credentials', component: CredentialsComponent, canActivate:[AuthGuard]},
  { path: 'verifyUser', component: VerifyUserComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    UserDetailComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    MakerFormComponent,
    BedrijfOpdrachtenComponent,
    MakerComponent,
    OpdrachtDetailComponent,
    BedrijfComponent,
    UserOpdrachtenComponent,
    OpdrachtStemmenComponent,
    GestemdeOpdrachtenComponent,
    BedrijfReviewComponent,
    SchrijfReviewComponent,
    NgbdToastGlobal,
    ToastsContainer,
    OpdrachtMakerComponent,
    MakerReviewComponent,
    SchrijfMakerreviewComponent,
    ResetPasswordComponent
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
    TagInputModule, 
    BrowserAnimationsModule,
    FormsModule,
    Ng2SearchPipeModule
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
  bootstrap: [
    AppComponent,
    NgbdToastGlobal]
})
export class AppModule { }

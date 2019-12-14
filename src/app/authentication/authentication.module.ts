import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsComponent } from './credentials/credentials.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';



@NgModule({
  declarations: [CredentialsComponent, VerifyUserComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule
  ]
})
export class AuthenticationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsComponent } from './credentials/credentials.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';



@NgModule({
  declarations: [CredentialsComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule
  ]
})
export class AuthenticationModule { }

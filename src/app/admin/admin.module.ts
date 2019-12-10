import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './admin.service';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    NgbModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }

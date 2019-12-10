import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }

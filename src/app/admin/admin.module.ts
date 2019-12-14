import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { BedrijfFormComponent } from './bedrijf-form/bedrijf-form.component';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [AdminComponent, BedrijfFormComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    FilterPipeModule,
    TagInputModule,
    ReactiveFormsModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }

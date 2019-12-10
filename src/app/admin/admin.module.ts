import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from './admin.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    NgbModule,
    Ng2SearchPipeModule,
    FormsModule,
    FilterPipeModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }

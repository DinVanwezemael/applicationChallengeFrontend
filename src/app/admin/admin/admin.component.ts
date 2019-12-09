import { Component, OnInit } from '@angular/core';
import { Maker } from 'src/app/models/maker.model';
import { AdminService } from '../admin.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  makers: Maker[] = [];
  bedrijven: Bedrijf[] = [];
  i: number = 0;

  constructor(private _adminService: AdminService) { }

  ngOnInit() {
    this._adminService.getMakers().subscribe(result => {
      this.makers = result;
    })
    
    this._adminService.getBedrijven().subscribe(result => {
      this.bedrijven = result;
    })
  }

}

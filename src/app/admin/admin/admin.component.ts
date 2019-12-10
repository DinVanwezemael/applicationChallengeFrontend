import { Component, OnInit } from '@angular/core';
import { Maker } from 'src/app/models/maker.model';
import { AdminService } from '../admin.service';
import { Bedrijf } from 'src/app/models/bedrijf.model';
import { Review } from 'src/app/models/review.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  makers: Maker[] = [];
  bedrijven: Bedrijf[] = [];
  reviews: Review[] = [];
  i: number = 0;

  constructor(private _adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this._adminService.getMakers().subscribe(result => {
      this.makers = result;
    })
    
    this._adminService.getBedrijven().subscribe(result => {
      this.bedrijven = result;
    })
    
    this._adminService.getReviews().subscribe(result => {
      this.reviews = result;
    })
  }

  addMaker(){
    this.router.navigate(['makerForm'])
  }
}

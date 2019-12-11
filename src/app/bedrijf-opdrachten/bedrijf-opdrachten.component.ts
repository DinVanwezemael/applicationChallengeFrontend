import { Component, OnInit } from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import { Bedrijf } from '../models/bedrijf.model';
import { BedrijfService } from '../services/bedrijf.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bedrijf-opdrachten',
  templateUrl: './bedrijf-opdrachten.component.html',
  styleUrls: ['./bedrijf-opdrachten.component.scss']
})
export class BedrijfOpdrachtenComponent implements OnInit {
bedrijf:Bedrijf;
  constructor(private _bedrijfService:BedrijfService, private router:Router) { }
  ngOnInit() {
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
      this._bedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.bedrijf = result;
        console.log(result)
      });
    }
    naarDetails(opdrachtId:number){
      this.router.navigate(['opdrachtDetail'], { queryParams: { opdrachtId:opdrachtId,bedrijfId:this.bedrijf.id } })
    }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OpdrachtService } from 'src/app/services/opdracht.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Opdracht } from 'src/app/models/opdracht.model';
import * as jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-gestemde-opdrachten',
  templateUrl: './gestemde-opdrachten.component.html',
  styleUrls: ['./gestemde-opdrachten.component.scss']
})
export class GestemdeOpdrachtenComponent implements OnInit {

  constructor(private OpdrachtService: OpdrachtService, private fb: FormBuilder, private router: Router) { }

  opdrachten: Observable<any[]>;
  userid

  viewOpdracht(id: number){
    this.router.navigate(['opdracht-stemmen'], { queryParams: { opdrachtId:id } })
  }


  getOpdrachten(){
    this.opdrachten = this.OpdrachtService.getOpdrachtenVoorStudentId(this.userid);
    console.log("################");
    console.log(this.opdrachten);
  }

  ngOnInit() {

    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.userid = tokenPayload.GebruikerId;

    this.getOpdrachten();
    console.log(this.opdrachten);
  }

}

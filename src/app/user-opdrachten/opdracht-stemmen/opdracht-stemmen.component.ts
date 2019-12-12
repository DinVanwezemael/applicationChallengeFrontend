import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OpdrachtService } from 'src/app/services/opdracht.service';
import { OpdrachtMakerService } from 'src/app/services/opdracht-maker.service';
import { OpdrachtMaker } from 'src/app/models/opdracht-maker.model';
import * as jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-opdracht-stemmen',
  templateUrl: './opdracht-stemmen.component.html',
  styleUrls: ['./opdracht-stemmen.component.scss']
})
export class OpdrachtStemmenComponent implements OnInit {

  constructor(private _OpdrachtService:OpdrachtService, private _OpdrachtMakerService: OpdrachtMakerService,private route: ActivatedRoute, private fb: FormBuilder,private router:Router) { }
  opdracht;
  opdrachtId
  userid

  deelnemen(){

    let opdrachtMaker: OpdrachtMaker = {
      makerid: this.userid,
      opdrachtid: this.opdrachtId
    }

    console.log(opdrachtMaker);

    this._OpdrachtMakerService.insertDeelname(opdrachtMaker).subscribe();

  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.opdrachtId = params.opdrachtId;
        if(params.opdrachtId !=null){
          this._OpdrachtService.getWhereId(params.opdrachtId).subscribe(result => {
            this.opdracht = result;
            console.log(result)
          });
        }

      });

    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.userid = tokenPayload.GebruikerId;
  }

}

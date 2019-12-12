import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OpdrachtService } from 'src/app/services/opdracht.service';
import { OpdrachtMakerService } from 'src/app/services/opdracht-maker.service';
import { OpdrachtMaker } from 'src/app/models/opdracht-maker.model';
import * as jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Opdracht } from 'src/app/models/opdracht.model';

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
  voted = false;
  opdrachtmakerid;

  deelnemen(){

    let opdrachtMaker: OpdrachtMaker = {
      makerid: this.userid,
      opdrachtid: this.opdrachtId
    }

    console.log(opdrachtMaker);

    this._OpdrachtMakerService.insertDeelname(opdrachtMaker).subscribe();

  }


  uitschrijvenOpdracht(inschrijvingId){
    console.log(inschrijvingId);
    this._OpdrachtMakerService.deleteDeelname(inschrijvingId).subscribe();
  }



  get(){

    let opdrachtMaker: OpdrachtMaker = {
      makerid: this.userid,
      opdrachtid: this.opdrachtId
    }
    console.log(opdrachtMaker);
    this._OpdrachtService.getVoted(this.opdrachtId, opdrachtMaker).subscribe(
      result => {
        this.opdrachtmakerid = result[0].id;
        console.log(result[0].id);
        this.voted = true;
      },
      err =>{
        this.voted = false;
      }
    );

    
    
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

    this.get();

  }

}

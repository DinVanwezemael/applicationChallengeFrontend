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
import { MakerService } from 'src/app/services/maker.service';
import { BedrijfService } from 'src/app/services/bedrijf.service';

@Component({
  selector: 'app-opdracht-stemmen',
  templateUrl: './opdracht-stemmen.component.html',
  styleUrls: ['./opdracht-stemmen.component.scss']
})
export class OpdrachtStemmenComponent implements OnInit {

  constructor(private _OpdrachtService:OpdrachtService, private _OpdrachtMakerService: OpdrachtMakerService,private route: ActivatedRoute, private fb: FormBuilder,private router:Router, private _MakerService: MakerService, private _BedrijfService: BedrijfService) { }
  opdracht;
  opdrachtId
  userid
  voted = false;
  opdrachtmakerid;
  profielfoto;
  gemiddeldeReviewScore;
  bedrijfId;
  stars="";

  deelnemen(){

    let opdrachtMaker: OpdrachtMaker = {
      makerid: this.userid,
      opdrachtid: this.opdrachtId
    }

    console.log(opdrachtMaker);

    this._OpdrachtMakerService.insertDeelname(opdrachtMaker).subscribe(
      result =>{
        this._OpdrachtService.getWhereId(this.opdrachtId).subscribe(result => {
          this.opdracht = result;
          this.get();
        });
      }
    );

  }


  uitschrijvenOpdracht(inschrijvingId){
    console.log(inschrijvingId);
    this._OpdrachtMakerService.deleteDeelname(inschrijvingId).subscribe(
      result =>{
        this._OpdrachtService.getWhereId(this.opdrachtId).subscribe(result => {
          this.opdracht = result;
          this.get();
        },
        err => {
        }
        );
      }
    );
  }



  get(){

    let opdrachtMaker: OpdrachtMaker = {
      makerid: this.userid,
      opdrachtid: this.opdrachtId
    }
    console.log(opdrachtMaker);
    this._OpdrachtService.getVoted(this.opdrachtId, opdrachtMaker).subscribe(
      result => {

        if(result == null){
          this.voted = false;
        }
        else{
          this.opdrachtmakerid = result[0].id;
          this.voted = true;
        }
        
      },
      err =>{
        this.voted = false;
        console.log(err);
      }
    );

    
    
  }

  getReviewScore(id){
    this._BedrijfService.getGemiddeldeScoreBedrijf(id).subscribe(
      result => {
        this.gemiddeldeReviewScore = result;

        console.log(result);
        
        for(var i = 0; i < result; i++){
          this.stars += '<i class="fas fa-star"></i>';
        }
      }
    );
  }

  haalMakerOp(){
    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    if(tokenPayload.role == "Maker"){
      this._MakerService.getMakerWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.profielfoto = "https://localhost:44341/images/"+result.foto;
      });
    }
    if(tokenPayload.role == "Bedrijf"){
      this._BedrijfService.getBedrijfWhereId(tokenPayload.GebruikerId).subscribe(result => {
        this.profielfoto = "https://localhost:44341/images/"+result.foto;
        console.log(result.foto)
      });
    }
  } 


  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.opdrachtId = params.opdrachtId;
        if(params.opdrachtId !=null){
          this._OpdrachtService.getWhereId(params.opdrachtId).subscribe(result => {
            this.opdracht = result;
            this.bedrijfId = result.bedrijfId;
            this.getReviewScore(result.bedrijfId);
          });
        }

      });


    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.userid = tokenPayload.GebruikerId;

    this.get();
    this.haalMakerOp();
    

  }

}

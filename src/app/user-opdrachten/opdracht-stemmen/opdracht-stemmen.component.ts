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
import { OpdrachtTagService } from 'src/app/services/opdracht-tag.service';
import { OpdrachtTag } from 'src/app/models/opdrachtTag.model';
import { ToastService } from 'src/app/toast-global/toast-service';

@Component({
  selector: 'app-opdracht-stemmen',
  templateUrl: './opdracht-stemmen.component.html',
  styleUrls: ['./opdracht-stemmen.component.scss'],
  styles: [`
    .star {
      position: relative;
      display: inline-block;
      font-size: 3rem;
      color: #d3d3d3;
    }
    .full {
      color: #F7BC07;
    }
    .half {
      position: absolute;
      display: inline-block;
      overflow: hidden;
      color: #F7BC07;
    }
  `]
})
export class OpdrachtStemmenComponent implements OnInit {

  constructor(private _OpdrachtService:OpdrachtService, private _OpdrachtTagService: OpdrachtTagService, private _OpdrachtMakerService: OpdrachtMakerService,private route: ActivatedRoute, private fb: FormBuilder,private router:Router, private _MakerService: MakerService, private _BedrijfService: BedrijfService, private toastService: ToastService) { }
  opdracht;
  opdrachtId
  userid
  geaccepteerd
  voted = false;
  opdrachtmakerid;
  profielfoto;
  gemiddeldeReviewScore;
  bedrijfId;
  stars="";
  opdrachtTags: OpdrachtTag[];

  deelnemen(){

    let opdrachtMaker: OpdrachtMaker = {
      makerid: this.userid,
      opdrachtId: this.opdrachtId,
      geaccepteerd: false
    }

    console.log(opdrachtMaker);

    this._OpdrachtMakerService.insertDeelname(opdrachtMaker).subscribe(
      result =>{
        this._OpdrachtService.getWhereId(this.opdrachtId).subscribe(result => {
          this.opdracht = result;
          this.get();
          console.log("toast");
          this.toastService.show('Je bent ingeschreven voor de opdracht !', { classname: 'bg-success text-light', delay: 10000 });
        });
      }
    );

  }

  viewBedrijf(bedrijfId){
    this.router.navigate(['bedrijf-review'], { queryParams: { bedrijfId:bedrijfId } });
  }


  uitschrijvenOpdracht(inschrijvingId){
    console.log(inschrijvingId);
    this._OpdrachtMakerService.deleteDeelname(inschrijvingId).subscribe(
      result =>{
        this._OpdrachtService.getWhereId(this.opdrachtId).subscribe(result => {
          this.opdracht = result;
          this.get();
          this.toastService.show('Je bent uitgeschreven voor de opdracht!', { classname: 'bg-danger text-light', delay: 10000 });
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
      opdrachtId: this.opdrachtId,
      geaccepteerd: this.geaccepteerd
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


  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.opdrachtId = params.opdrachtId;
        if(params.opdrachtId !=null){
          this._OpdrachtService.getWhereId(params.opdrachtId).subscribe(result => {
            this.opdracht = result;
            console.log(result);
            this.bedrijfId = result.bedrijfId;
            this.getReviewScore(result.bedrijfId);
            if(result.bedrijf.foto == null){
              this.profielfoto = "https://api.adorable.io/avatars/285/" + result.bedrijf.id + "@adorable.png";
            }
            else{
              this.profielfoto = "https://localhost:44341/images/"+result.bedrijf.foto;
            }
            this._OpdrachtTagService.getWhereBedrijfId(result.id).subscribe(result => {
              this.opdrachtTags = result;
            })
          });
        }

      });


    const token = localStorage.getItem('token')
    const tokenPayload : any = jwtDecode(token);
    this.userid = tokenPayload.GebruikerId;

    this.get();
    
    
  }

}

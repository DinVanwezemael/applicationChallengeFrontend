import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakerService } from '../services/maker.service';
import { Maker } from '../models/maker.model';

@Component({
  selector: 'app-opdracht-maker',
  templateUrl: './opdracht-maker.component.html',
  styleUrls: ['./opdracht-maker.component.scss'],
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
export class OpdrachtMakerComponent implements OnInit {

  constructor(private route: ActivatedRoute,private _MakerService:MakerService, private router:Router) { }
makerId:number;
maker:Maker;
profielfoto;
gemiddeldeReviewScore;
stars;
  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.makerId = params.makerId;
      if(params.makerId !=null){
        this._MakerService.getMakerWhereId(params.makerId).subscribe(result => {
          this.maker = result;
          console.log(result.nickname)
          this.getReviewScore(result.id);
          if(result.foto == null){
            this.profielfoto = "https://api.adorable.io/avatars/285/" + result.id + "@adorable.png";
          }
          else{
            this.profielfoto = "https://localhost:44341/images/"+result.foto;
          }
        });
      }

    });
  }

  viewReviews(makerId){
    this.router.navigate(['maker-review'], { queryParams: { makerId:makerId } });
  }
  getReviewScore(id){
    this._MakerService.getGemiddeldeScoreMaker(id).subscribe(
      result => {
        this.gemiddeldeReviewScore = result;

        console.log(result);
        
        for(var i = 0; i < result; i++){
          this.stars += '<i class="fas fa-star"></i>';
        }
      }
    );
  }
}

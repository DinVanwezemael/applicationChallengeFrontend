import { Component, OnInit } from '@angular/core';
import { Opdracht } from '../models/opdracht.model';
import { OpdrachtService } from '../services/opdracht.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { fakeAsync } from '@angular/core/testing';

@Component({
  selector: 'app-opdracht-detail',
  templateUrl: './opdracht-detail.component.html',
  styleUrls: ['./opdracht-detail.component.scss']
})
export class OpdrachtDetailComponent implements OnInit {
Opdracht:Opdracht;
editOpdracht=false;
newOpdracht=false;
opdrachtForm: FormGroup;
  constructor(private _OpdrachtService:OpdrachtService,private route: ActivatedRoute,private fb: FormBuilder,private router:Router) { }

  ngOnInit(){
    this.route.queryParams
      .subscribe(params => {
        if(params.opdrachtId !=null){
          this.newOpdracht=false;
          this._OpdrachtService.getWhereId(params.opdrachtId).subscribe(result => {
            this.Opdracht = result;
            console.log(result)
          });
        }else{
          this.newOpdracht=true;
          this.editOpdracht=true;
        }

      });
      this.opdrachtForm = this.fb.group({
        Titel: new FormControl('', Validators.required),
        Omschrijving: new FormControl('', Validators.required),
        Locatie: new FormControl('', Validators.required),
        Id: new FormControl('', Validators.required),
        BedrijfId: new FormControl('', Validators.required),
      })
  }
  editOpdrachtDetails(){
    if(this.editOpdracht == true){
      this.editOpdracht = false;
    }
    else{
      this.editOpdracht = true;
    }
  }
  deleteOpdracht(id){
    this._OpdrachtService.deleteOpdracht(id).subscribe(
      result => {
        this.router.navigate(["bedrijfOpdrachten"]);
      }
    );
  }
  saveChangesOpdracht(){

    this._OpdrachtService.editOpdracht(this.opdrachtForm.controls['Id'].value , this.opdrachtForm.value).subscribe(
      result => {
        this.editOpdracht = false;
      },
      err => {
        alert("opdracht bestaat al")
      }
    );
  }

}

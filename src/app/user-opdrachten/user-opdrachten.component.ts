import { Component, OnInit } from '@angular/core';
import { OpdrachtService } from '../services/opdracht.service';
import { Opdracht } from '../models/opdracht.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-opdrachten',
  templateUrl: './user-opdrachten.component.html',
  styleUrls: ['./user-opdrachten.component.scss']
})
export class UserOpdrachtenComponent implements OnInit {

  constructor(private OpdrachtService: OpdrachtService, private fb: FormBuilder, private router: Router) { }

  opdrachten: Observable<Opdracht[]>;

  searchForm = this.fb.group({
    Title: new FormControl('', Validators.required)
  })


  getOpdrachtenBySearch(){
    console.log(this.searchForm.controls["Title"].value);
    this.opdrachten = this.OpdrachtService.getOpdrachtenVoorStudentBySearch(this.searchForm.controls["Title"].value);
  }

  viewOpdracht(id: number){
    this.router.navigate(['opdrachtDetail'], { queryParams: { opdrachtId:id } })
  }


  getOpdrachten(){
    this.opdrachten = this.OpdrachtService.getOpdrachtenVoorStudent();
  }

  ngOnInit() {
    this.getOpdrachten();
    console.log(this.opdrachten);
  }

}

import { Component, OnInit } from '@angular/core';
import { OpdrachtService } from '../services/opdracht.service';
import { Opdracht } from '../models/opdracht.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-opdrachten',
  templateUrl: './user-opdrachten.component.html',
  styleUrls: ['./user-opdrachten.component.scss']
})
export class UserOpdrachtenComponent implements OnInit {
  opdrachten = new BehaviorSubject<Opdracht[]>([]);

  constructor(private OpdrachtService: OpdrachtService, private fb: FormBuilder, private router: Router) { }

  contentEditable = true;

  searchForm = this.fb.group({
    Title: new FormControl('', Validators.required)
  })

  toggleEditable(event) {
    if (event.target.checked) {
      this.contentEditable = true;
      if (this.searchForm.controls["Title"].value != "") {
        this.getOpdrachtenBySearch();
      } else {
        this.getOpdrachtenOpen();
      }
    } else {
      this.contentEditable = false;
      if (this.searchForm.controls["Title"].value != "") {
        this.getOpdrachtenBySearch();
      } else {
        this.getOpdrachten();
      }
    }
  }


  getOpdrachtenBySearch() {
    if (this.contentEditable == true) {
      if (this.searchForm.controls["Title"].value != "") {
        this.OpdrachtService.getOpdrachtenVoorStudentBySearchOpen(this.searchForm.controls["Title"].value)
          .subscribe(result => {
            this.opdrachten.next(result.sort(function (a, b) { return b.interest - a.interest }));
          });
      } else {
        this.getOpdrachten();
      }
    } else {
      if (this.searchForm.controls["Title"].value != "") {
        this.OpdrachtService.getOpdrachtenVoorStudentBySearch(this.searchForm.controls["Title"].value)
          .subscribe(result => {
            this.opdrachten.next(result.sort(function (a, b) { return b.interest - a.interest }));
          });
      } else {
        this.getOpdrachtenOpen();
      }
    }
  }

  viewOpdracht(id: number) {
    this.router.navigate(['opdracht-stemmen'], { queryParams: { opdrachtId: id } })
  }


  getOpdrachten() {
    this.OpdrachtService.getOpdrachtenVoorStudent().subscribe(result => {
      console.log(result);
      this.opdrachten.next(result.sort(function (a, b) { return b.interest - a.interest }));
    });
  }

  getOpdrachtenOpen() {
    this.OpdrachtService.getOpdrachtenVoorStudentOpen().subscribe(result => {
      console.log(result);
      this.opdrachten.next(result.sort(function (a, b) { return b.interest - a.interest }));
      console.log(result);
    });
  }



  ngOnInit() {

    if (this.contentEditable == false) {
      this.getOpdrachten();
    } else {
      this.getOpdrachtenOpen();
    }
  }

}

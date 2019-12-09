import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  triggered: Boolean = false;
  uploader:FileUploader;
  profielfoto = "https://localhost:44341/images/jelle.jpeg"
  constructor() { 
  }

  ngOnInit() {
    this.triggered=false;
  }
  openFotoUpload(){
    if(this.triggered===true){
      this.triggered= false;
    }else{
      this.triggered = true;

    }
  }
}

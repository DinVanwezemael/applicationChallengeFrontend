import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-maker-form',
  templateUrl: './maker-form.component.html',
  styleUrls: ['./maker-form.component.scss']
})
export class MakerFormComponent implements OnInit {

  registerForm = this.fb.group({

  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}

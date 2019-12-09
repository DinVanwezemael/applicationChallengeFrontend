import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  registerForm: FormGroup;

  onSubmit(){
    console.log(this.registerForm.value);
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      voornaam: new FormControl('', Validators.required),
    achternaam: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    wachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
    herhaalWachtwoord: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })

    if(this.registerForm.controls['wachtwoord'].value == this.registerForm.controls['herhaalWachtwoord'].value){
      
    }
  }

}

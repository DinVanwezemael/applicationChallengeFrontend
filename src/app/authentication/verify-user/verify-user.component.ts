import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {
  id = null;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authenticateService: AuthenticateService) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['userLoginId'];
      console.log(this.id); // Print the parameter to the console. // verifyUser?userLoginId=1
  });
  }

  ngOnInit() {
    if (this.id != null) {
      this.authenticateService.verifyUser(this.id).subscribe();
    }
  }

  gotoLogin() {
    this.router.navigate(['login'])
  }

}

import { Component, OnInit } from '@angular/core';
import { Maker } from 'src/app/models/maker.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  makers: Maker[] = [{id: 0, nickname: "agit15", voornaam: "agit", achternaam: "basar", email: "test", geboorteDatum: null, biografie: "test", linkedInLink: "test", ervaring: 1, gsmNr: "04", cV: "test", foto: "test", opdrachtId: 1}];

  constructor() { }

  ngOnInit() {
  }

}

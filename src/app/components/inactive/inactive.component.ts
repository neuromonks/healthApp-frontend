import { Component, OnInit } from '@angular/core';
import {AuthService, CommonService} from "../../services";

@Component({
  selector: 'app-inactive',
  templateUrl: './inactive.component.html',
  styleUrls: ['./inactive.component.css']
})
export class InactiveComponent implements OnInit {

  constructor(private commonService: CommonService,
              private authService:AuthService) { }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
  }

}

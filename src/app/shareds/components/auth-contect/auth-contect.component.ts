import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
declare const App: any;
@Component({
  selector: 'app-auth-contect',
  templateUrl: './auth-contect.component.html',
  styleUrls: ['./auth-contect.component.css']
})
export class AuthContectComponent implements OnInit {
	loading = false;

  constructor(
  	private commonService : CommonService
  	) { }

  ngOnInit() {
    App.initialLoadPage();
    this.commonService.subscribe("loader", (value) => { 
    	if(value['payload']){
    		this.loading= true;
    	}else{
    		this.loading = false;
    	}
     });
  }


}
